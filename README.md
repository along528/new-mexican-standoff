# New Mexican Standoff

https://along528.github.io/new-mexican-standoff/

## Local Development

Shows are fetched from a published Google Sheet, which requires a real HTTP origin (not `file://`). To test locally:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/index.html
