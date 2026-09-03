# Testing Strategy

## Retrieval Tests

Verify:
- Relevant patents are retrieved.
- Irrelevant documents are filtered.
- Cross-domain solutions can be discovered.
- Mechanism matching can outperform simple keyword matching.

## Extraction Tests

Verify extraction of:
- Mechanism
- Materials
- Processes
- Conditions
- Limitations
- Evidence

## Generation Tests

Verify:
- Recommendations are source-grounded.
- Unsupported claims are not presented as facts.
- Prototype instructions accurately reflect source material.
- Constraints are respected.

## Provenance Tests

Every major technical claim should be traceable to evidence.

## Fusion Tests

Test whether:
- Multiple sources are compatible.
- Contributions are correctly attributed.
- Conflicts are detected.
- Unsupported combinations are flagged.

## Reverse Search Tests

Input an existing prototype and evaluate:
- Similar prior art
- Relevant patents
- Similar mechanisms
- Potential improvements

## Evaluation Metrics

- Retrieval Precision
- Retrieval Recall
- Mechanism Match Accuracy
- Evidence Coverage
- Citation Accuracy
- Hallucination Rate
- User Satisfaction
- Prototype Usefulness
- Time to Useful Result
