# API Documentation

## Problem Search

`POST /api/search`

Input:
```json
{
  "problem": "",
  "constraints": {}
}
```

Output:
```json
{
  "problem_analysis": {},
  "matches": [],
  "recommendations": [],
  "sources": []
}
```

## Reverse Prior-Art Search

`POST /api/prior-art`

Input:
```json
{
  "idea": "",
  "description": ""
}
```

Output:
```json
{
  "similar_prior_art": [],
  "mechanisms": [],
  "risks": [],
  "improvements": []
}
```
