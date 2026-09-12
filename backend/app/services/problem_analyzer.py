"""
Problem Understanding & Decomposition Layer.
Converts raw natural-language operational problems into structured representations,
extracting functional requirements and underlying physical/chemical/engineering mechanisms.
"""
import json
import logging
import re
from typing import Dict, Any, List
from app.models.schemas import ProblemInput, ProblemAnalysis, Constraints
from app.config import settings

logger = logging.getLogger(__name__)

try:
    # pyrefly: ignore [missing-import]
    from google import genai
    GENAI_LIB_AVAILABLE = True
except ImportError:
    GENAI_LIB_AVAILABLE = False


def is_gemini_configured() -> bool:
    return GENAI_LIB_AVAILABLE and bool(settings.GEMINI_API_KEY)


def analyze_problem(input_data: ProblemInput) -> ProblemAnalysis:
    """
    Analyzes the user's problem description and extracts functional requirements,
    underlying mechanisms, constraints, and target context.
    """
    raw_problem = input_data.problem.strip()
    constraints = input_data.constraints

    if is_gemini_configured():
        try:
            return _analyze_with_gemini(raw_problem, input_data.desired_outcome, input_data.domain, constraints)
        except Exception as e:
            logger.warning(f"[ProblemAnalyzer] Gemini analysis fallback due to error: {e}")

    return _analyze_heuristic(raw_problem, input_data.desired_outcome, input_data.domain, constraints)


def _analyze_with_gemini(problem_text: str, desired_outcome: str, user_domain: str, constraints: Constraints) -> ProblemAnalysis:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    prompt = f"""
You are an expert open-innovation engineer and technical mechanism analyst.
Decompose the following real-world operational problem into its underlying physical, chemical, mechanical, thermal, biological, or computational/algorithmic mechanisms.

Problem Statement: "{problem_text}"
Desired Outcome: "{desired_outcome}"
User Domain: "{user_domain}"
Constraints: Budget={constraints.budget}, Materials={constraints.materials}, Location={constraints.location}, Scale={constraints.scale}

Respond strictly in JSON matching this schema:
{{
  "target_user": "description of who faces this problem",
  "domain": "primary technical or operational domain (e.g. Distributed Systems / Cloud Infrastructure, Software Architecture / Microservices, Thermal Management / Cold Chain Logistics, Water Treatment, Agriculture)",
  "operational_context": "summary of environment and real-world limits",
  "functional_requirements": ["list of key functional actions needed"],
  "underlying_mechanisms": ["list of 3-5 core underlying physical/chemical/engineering/computational mechanisms, e.g. 'consistent hashing with virtual node distribution', 'sliding-window circuit breaking with fallback isolation', 'sorption-desorption moisture desiccation', 'Peltier-effect solid-state thermoelectric heat pumping'"],
  "keywords": ["list of 5-8 search terms combining problem and mechanism concepts"]
}}
"""
    model_names = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash']
    response = None
    for model_name in model_names:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            if response:
                break
        except Exception as e:
            logger.warning(f"Gemini model {model_name} failed: {e}. Trying next...")
            continue
    
    if not response:
        raise RuntimeError("All Gemini models failed")
    
    data = json.loads(response.text)
    
    return ProblemAnalysis(
        problem_raw=problem_text,
        target_user=data.get("target_user", "Field Operator / Builder"),
        domain=data.get("domain", user_domain or "General Engineering"),
        operational_context=data.get("operational_context", f"Location: {constraints.location or 'General'}, Scale: {constraints.scale}"),
        functional_requirements=data.get("functional_requirements", ["Solve target operational problem"]),
        underlying_mechanisms=data.get("underlying_mechanisms", ["Physical / Chemical / Computational process"]),
        keywords=data.get("keywords", _extract_basic_keywords(problem_text)),
        constraint_vector=constraints.model_dump()
    )


def _matches_any(text_lower: str, words_set: set, keywords: List[str]) -> bool:
    for kw in keywords:
        if " " in kw or "-" in kw:
            if kw in text_lower:
                return True
        else:
            if kw in words_set:
                return True
    return False


def _analyze_heuristic(problem_text: str, desired_outcome: str, user_domain: str, constraints: Constraints) -> ProblemAnalysis:
    text_lower = problem_text.lower()
    words_set = set(re.findall(r'\b[a-z0-9_-]+\b', text_lower))
    mechanisms = []
    functional_reqs = []
    detected_domain = user_domain or ""
    target_user = "Field Operator & Builder"

    # 1. Distributed Caching & Invalidation
    if _matches_any(text_lower, words_set, ["cache", "caching", "invalidation", "stale read", "memcached", "redis", "key-value", "stampede", "thundering herd"]):
        mechanisms.append("Consistent hashing with virtual node distribution on circular keyspace")
        mechanisms.append("Lease-based cache invalidation and probabilistic early expiration (XFetch)")
        mechanisms.append("Asynchronous invalidation broadcasting via pub-sub distribution channel")
        functional_reqs.append("Eliminate stale reads and prevent cache stampedes across distributed nodes")
        functional_reqs.append("Bound key remapping to 1/N during node joins, failures, or evictions")
        if not detected_domain:
            detected_domain = "Distributed Systems / In-Memory Caching"
        target_user = "Cloud Infrastructure & Distributed Systems Architect"

    # 2. Microservices, Resilience & Circuit Breakers
    if _matches_any(text_lower, words_set, ["circuit breaker", "cascading failure", "microservice", "failover", "hystrix", "resilience", "backoff", "thread starvation"]):
        mechanisms.append("Sliding-window error thresholding with automatic circuit state tripping (Closed/Open/Half-Open)")
        mechanisms.append("Fallback request short-circuiting to isolate downstream dependency latency")
        mechanisms.append("Exponential backoff with jittered retry scheduling")
        functional_reqs.append("Prevent cascading thread starvation and system outages during service failures")
        functional_reqs.append("Provide fail-fast responses within 1ms under degraded downstream conditions")
        if not detected_domain:
            detected_domain = "Software Architecture / Microservices & Reliability Engineering"
        target_user = "Backend Engineering Lead / SRE"

    # 3. API Gateways & Rate Limiting / Traffic Shaping
    if _matches_any(text_lower, words_set, ["rate limit", "rate-limit", "token bucket", "leaky bucket", "throttl", "api gateway", "traffic shaping", "429"]):
        mechanisms.append("Atomic token-bucket traffic shaping with fractional burst capacity")
        mechanisms.append("Distributed synchronized quota replenishment across edge reverse proxies")
        mechanisms.append("Client identity hashing and dynamic HTTP 429 Retry-After enforcement")
        functional_reqs.append("Throttle volumetric request surges while preserving burst capacity for legitimate API clients")
        functional_reqs.append("Enforce cluster-wide rate limits with sub-millisecond evaluation overhead")
        if not detected_domain:
            detected_domain = "Networking / API Gateways & Traffic Engineering"
        target_user = "API Platform Engineer / Security Architect"

    # 4. Distributed Consensus & Replication
    if _matches_any(text_lower, words_set, ["consensus", "paxos", "raft", "log replication", "split-brain", "quorum", "leader election", "state machine replication"]):
        mechanisms.append("Monotonic term leader election with randomized heartbeat timeouts")
        mechanisms.append("Two-phase append-only write-ahead log replication across majority quorums")
        mechanisms.append("Deterministic finite state machine transition verification")
        functional_reqs.append("Guarantee linearizable state machine consistency across asymmetric network partitions")
        functional_reqs.append("Maintain cluster liveness without manual intervention during node failovers")
        if not detected_domain:
            detected_domain = "Distributed Systems / Consensus & Fault Tolerance"
        target_user = "Distributed Database & Systems Infrastructure Engineer"

    # 5. Vector Search & AI Embeddings
    if _matches_any(text_lower, words_set, ["vector", "embedding", "hnsw", "nearest neighbor", "ann", "similarity search", "high-dimensional", "rag"]):
        mechanisms.append("Hierarchical multi-layer proximity graph traversal with greedy routing (HNSW)")
        mechanisms.append("SIMD-accelerated cosine and Euclidean distance metric calculation")
        mechanisms.append("Sub-linear vector candidate beam search with heuristic edge pruning")
        functional_reqs.append("Execute sub-5ms approximate nearest neighbor queries across high-dimensional vector spaces")
        functional_reqs.append("Sustain high retrieval recall (>98%) with bounded memory footprint")
        if not detected_domain:
            detected_domain = "Artificial Intelligence / Vector Databases & Semantic Retrieval"
        target_user = "AI/ML Infrastructure Engineer"

    # 6. Cryptography & Zero-Knowledge Proofs
    if _matches_any(text_lower, words_set, ["cryptograph", "zero-knowledge", "zk-snark", "snark", "stark", "bilinear pairing", "arithmetic circuit", "private transaction"]):
        mechanisms.append("Elliptic curve bilinear pairing evaluation of Rank-1 Constraint Systems (R1CS)")
        mechanisms.append("Succinct O(1) constant-time zero-knowledge proof verification without witness leakage")
        mechanisms.append("Polynomial commitment verification over pairing-friendly curves")
        functional_reqs.append("Verify computational state correctness without revealing private inputs")
        functional_reqs.append("Produce compact constant-size cryptographic proofs for trustless verification")
        if not detected_domain:
            detected_domain = "Cryptography / Information Security & Privacy-Preserving Computing"
        target_user = "Cryptographic Security Engineer / Blockchain Architect"

    # 7. Event Streaming & Pub-Sub
    if _matches_any(text_lower, words_set, ["stream", "streaming", "kafka", "pub-sub", "publish-subscribe", "event bus", "commit log", "zero-copy", "message queue"]):
        mechanisms.append("Sequential append-only commit log partitioning with zero-copy OS sendfile dispatch")
        mechanisms.append("Independent consumer group offset tracking and multi-broker in-sync replica quorums")
        mechanisms.append("High-throughput partitioned batch serialization")
        functional_reqs.append("Sustain high-throughput (>1M msgs/sec) pub-to-sub message delivery with sub-10ms latency")
        functional_reqs.append("Provide horizontally scalable ordered message processing per partition")
        if not detected_domain:
            detected_domain = "Data Engineering / Event Streaming & Distributed Messaging"
        target_user = "Data Infrastructure Engineer / Streaming Systems Architect"

    # 8. Elder Care & Remote Monitoring
    if _matches_any(text_lower, words_set, ["elder", "aging", "parent", "caregiver", "telehealth", "patient monitoring", "pill", "medication compliance", "inactivity"]):
        mechanisms.append("Distributed wireless mesh telemetry coupled with multi-tier rule-based activity anomaly threshold detection")
        mechanisms.append("Time-windowed compartment state sensing with non-volatile access timestamp logging")
        mechanisms.append("Multi-tiered event priority queuing and hierarchical caregiver notification escalation routing")
        functional_reqs.append("Detect routine deviations and prolonged inactivity without intrusive cameras or continuous broadband")
        functional_reqs.append("Log timestamped physical medication compartment access to verify adherence")
        if not detected_domain:
            detected_domain = "Elder Care / Remote Patient Monitoring & IoT Telemetry"
        target_user = "Elderly Caregiver & Remote Telehealth Builder"

    # 9. General Software / Computing Concepts Fallback
    if not mechanisms and _matches_any(text_lower, words_set, ["software", "code", "app", "application", "database", "backend", "api", "server", "frontend", "latency", "system", "algorithm", "network", "cloud", "scale", "concurrency"]):
        mechanisms.append("Consistent hashing with partition-tolerant distributed routing")
        mechanisms.append("Adaptive sliding-window rate limiting and circuit breaking")
        mechanisms.append("Asynchronous event streaming and in-memory cache invalidation")
        functional_reqs.append("Ensure high availability, low latency, and horizontal scalability under high traffic")
        functional_reqs.append("Prevent cascading failure and eliminate performance bottlenecks")
        if not detected_domain:
            detected_domain = "Software Engineering / Distributed Systems Architecture"
        target_user = "Software Architect & Systems Engineer"

    # 10. Physical / Mechanical Domain Rules
    if _matches_any(text_lower, words_set, ["humidity", "moisture", "grain", "desiccant", "dry", "drying", "damp", "mold"]):
        mechanisms.append("Sorption-desorption moisture extraction via hygroscopic matrix")
        mechanisms.append("Vapor-pressure differential desiccation across polymer boundary")
        functional_reqs.append("Extract water vapor from enclosed storage without electrical grid power")
        functional_reqs.append("Prevent mold formation and spore proliferation")
        if not detected_domain:
            detected_domain = "Post-Harvest Agriculture / Moisture Control"
        target_user = "Agricultural Farmer & Grain Storage Cooperatives"

    if _matches_any(text_lower, words_set, ["cool", "cooling", "refrigerat", "peltier", "cold", "vaccine", "ice", "heat"]):
        mechanisms.append("Peltier-effect solid-state heat pumping across thermoelectric junction")
        mechanisms.append("Latent thermal energy absorption via microencapsulated phase-change material (PCM)")
        functional_reqs.append("Maintain regulated low temperature (2°C-8°C) in off-grid environments")
        functional_reqs.append("Buffer power interruptions using thermal energy storage")
        if not detected_domain:
            detected_domain = "Thermal Management / Cold Chain Logistics"
        target_user = "Healthcare Clinic Operator & Off-Grid Hardware Maker"

    if _matches_any(text_lower, words_set, ["water", "purif", "clean", "drink", "saline", "desalination", "filter", "turbid", "heavy metal"]):
        mechanisms.append("Osmotic pressure gradient driven forward osmosis mass transfer")
        mechanisms.append("Hydrophobic microporous vapor separation membrane filtration")
        functional_reqs.append("Separate dissolved salts, heavy metals, and microbes from raw water")
        functional_reqs.append("Operate passively without high-pressure pumps")
        if not detected_domain:
            detected_domain = "Water Treatment & Environmental Engineering"
        target_user = "Community Water Manager & NGO Relief Worker"

    if _matches_any(text_lower, words_set, ["power", "energy", "electr", "turbine", "hydro", "stream", "river", "generator", "head"]):
        mechanisms.append("Vortex hydrodynamic kinetic energy acceleration")
        mechanisms.append("Electromagnetic induction via low-rpm permanent magnet rotor")
        functional_reqs.append("Extract continuous rotational power from low-head water flow")
        functional_reqs.append("Generate 12V/24V DC battery charging current")
        if not detected_domain:
            detected_domain = "Renewable Energy / Hydrokinetics"
        target_user = "Off-Grid Community Engineer"

    if _matches_any(text_lower, words_set, ["straw", "waste", "insulat", "building", "panel", "composite", "citric", "resin"]):
        mechanisms.append("In-situ polyesterification crosslinking of citric acid bio-resin")
        mechanisms.append("Lignocellulosic fibrous entrapment creating dead-air thermal barriers")
        functional_reqs.append("Convert agricultural residue into rigid thermal insulation panel")
        functional_reqs.append("Achieve fire retardancy and water resistance")
        if not detected_domain:
            detected_domain = "Sustainable Materials & Green Building"
        target_user = "Rural Manufacturer & Builder"

    if not mechanisms:
        mechanisms = [
            "Thermodynamic phase change & mass transfer",
            "Mechanical kinetic force transfer & acoustic cavitation",
            "Sorption & chemical esterification crosslinking"
        ]
    if not functional_reqs:
        functional_reqs = [
            f"Achieve: {desired_outcome or 'Operational problem solution'}",
            "Maintain compliance with cost and material constraints"
        ]
    if not detected_domain:
        detected_domain = "General Engineering"

    keywords = _extract_basic_keywords(problem_text)

    return ProblemAnalysis(
        problem_raw=problem_text,
        target_user=target_user,
        domain=detected_domain,
        operational_context=f"Context: {constraints.location or 'Off-Grid / Cloud / Distributed'}, Scale: {constraints.scale or 'Production'}",
        functional_requirements=functional_reqs,
        underlying_mechanisms=mechanisms,
        keywords=keywords,
        constraint_vector=constraints.model_dump()
    )


def _extract_basic_keywords(text: str) -> List[str]:
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
    stop_words = {"need", "with", "from", "that", "this", "have", "been", "they", "will", "would", "could", "should", "some", "what", "where", "when", "your", "their", "into"}
    unique_words = [w for w in words if w not in stop_words]
    return list(dict.fromkeys(unique_words))[:8]
