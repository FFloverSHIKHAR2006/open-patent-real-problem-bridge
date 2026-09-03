"""
Problem Understanding & Decomposition Layer.
Converts raw natural-language operational problems into structured representations,
extracting functional requirements and underlying physical/chemical/engineering mechanisms.
"""
import json
import re
from typing import Dict, Any, List
from app.models.schemas import ProblemInput, ProblemAnalysis, Constraints
from app.config import settings

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
            print(f"[ProblemAnalyzer] Gemini analysis fallback due to error: {e}")

    return _analyze_heuristic(raw_problem, input_data.desired_outcome, input_data.domain, constraints)


def _analyze_with_gemini(problem_text: str, desired_outcome: str, user_domain: str, constraints: Constraints) -> ProblemAnalysis:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    prompt = f"""
You are an expert open-innovation engineer and technical mechanism analyst.
Decompose the following real-world operational problem into its underlying physical, chemical, mechanical, thermal, biological, or computational mechanisms.

Problem Statement: "{problem_text}"
Desired Outcome: "{desired_outcome}"
User Domain: "{user_domain}"
Constraints: Budget={constraints.budget}, Materials={constraints.materials}, Location={constraints.location}, Scale={constraints.scale}

Respond strictly in JSON matching this schema:
{{
  "target_user": "description of who faces this problem",
  "domain": "primary technical or operational domain",
  "operational_context": "summary of environment and real-world limits",
  "functional_requirements": ["list of key functional actions needed"],
  "underlying_mechanisms": ["list of 3-5 core underlying physical/chemical/engineering mechanisms, e.g. 'sorption-desorption moisture desiccation', 'osmotic pressure gradient', 'Peltier-effect solid-state heat pumping'"],
  "keywords": ["list of 5-8 search terms combining problem and mechanism concepts"]
}}
"""
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={'response_mime_type': 'application/json'}
    )
    
    data = json.loads(response.text)
    
    return ProblemAnalysis(
        problem_raw=problem_text,
        target_user=data.get("target_user", "Field Operator / Builder"),
        domain=data.get("domain", user_domain or "General Engineering"),
        operational_context=data.get("operational_context", f"Location: {constraints.location or 'General'}, Scale: {constraints.scale}"),
        functional_requirements=data.get("functional_requirements", ["Solve target operational problem"]),
        underlying_mechanisms=data.get("underlying_mechanisms", ["Physical / Chemical process"]),
        keywords=data.get("keywords", _extract_basic_keywords(problem_text)),
        constraint_vector=constraints.model_dump()
    )


def _analyze_heuristic(problem_text: str, desired_outcome: str, user_domain: str, constraints: Constraints) -> ProblemAnalysis:
    text_lower = problem_text.lower()
    mechanisms = []
    functional_reqs = []
    detected_domain = user_domain or "General Engineering"
    target_user = "Rural / Hardware Innovator & Builder"

    # Mechanism detection rules based on physical domain concepts
    if any(w in text_lower for w in ["humidity", "moisture", "grain", "desiccant", "dry", "drying", "damp", "mold"]):
        mechanisms.append("Sorption-desorption moisture extraction via hygroscopic matrix")
        mechanisms.append("Vapor-pressure differential desiccation across polymer boundary")
        functional_reqs.append("Extract water vapor from enclosed storage without electrical grid power")
        functional_reqs.append("Prevent mold formation and spore proliferation")
        if not user_domain:
            detected_domain = "Post-Harvest Agriculture / Moisture Control"
        target_user = "Agricultural Farmer & Grain Storage Cooperatives"

    if any(w in text_lower for w in ["cool", "cooling", "refrigerat", "peltier", "cold", "vaccine", "ice", "heat"]):
        mechanisms.append("Peltier-effect solid-state heat pumping across thermoelectric junction")
        mechanisms.append("Latent thermal energy absorption via microencapsulated phase-change material (PCM)")
        functional_reqs.append("Maintain regulated low temperature (2°C-8°C) in off-grid environments")
        functional_reqs.append("Buffer power interruptions using thermal energy storage")
        if not user_domain:
            detected_domain = "Thermal Management / Cold Chain Logistics"
        target_user = "Healthcare Clinic Operator & Off-Grid Hardware Maker"

    if any(w in text_lower for w in ["water", "purif", "clean", "drink", "saline", "desalination", "filter", "turbid", "heavy metal"]):
        mechanisms.append("Osmotic pressure gradient driven forward osmosis mass transfer")
        mechanisms.append("Hydrophobic microporous vapor separation membrane filtration")
        functional_reqs.append("Separate dissolved salts, heavy metals, and microbes from raw water")
        functional_reqs.append("Operate passively without high-pressure pumps")
        if not user_domain:
            detected_domain = "Water Treatment & Environmental Engineering"
        target_user = "Community Water Manager & NGO Relief Worker"

    if any(w in text_lower for w in ["power", "energy", "electr", "turbine", "hydro", "stream", "river", "generator", "head"]):
        mechanisms.append("Vortex hydrodynamic kinetic energy acceleration")
        mechanisms.append("Electromagnetic induction via low-rpm permanent magnet rotor")
        functional_reqs.append("Extract continuous rotational power from low-head water flow")
        functional_reqs.append("Generate 12V/24V DC battery charging current")
        if not user_domain:
            detected_domain = "Renewable Energy / Hydrokinetics"
        target_user = "Off-Grid Community Engineer"

    if any(w in text_lower for w in ["straw", "waste", "insulat", "building", "panel", "straw", "composite", "citric", "resin"]):
        mechanisms.append("In-situ polyesterification crosslinking of citric acid bio-resin")
        mechanisms.append("Lignocellulosic fibrous entrapment creating dead-air thermal barriers")
        functional_reqs.append("Convert agricultural residue into rigid thermal insulation panel")
        functional_reqs.append("Achieve fire retardancy and water resistance")
        if not user_domain:
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

    keywords = _extract_basic_keywords(problem_text)

    return ProblemAnalysis(
        problem_raw=problem_text,
        target_user=target_user,
        domain=detected_domain,
        operational_context=f"Context: {constraints.location or 'Off-Grid / Constrained'}, Scale: {constraints.scale or 'Pilot'}",
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
