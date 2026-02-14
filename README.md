# RegTech Control Center

A lightweight browser-based web application to track compliance controls and their status.

## Features

- Add controls with ID, name, owner, status, and notes.
- View real-time summary counts for compliant, at-risk, and non-compliant controls.
- Delete individual controls or clear all controls.
- Data persists in browser `localStorage`.

## Run locally

Because this project is plain HTML/CSS/JavaScript, you can run it with any static file server.

### Option 1: Python

```bash
python3 -m http.server 4173
```

Then open:

- http://localhost:4173

### Option 2: Open file directly

You can also open `index.html` in a browser directly.
