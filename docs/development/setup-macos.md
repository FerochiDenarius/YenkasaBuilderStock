# macOS setup

Install Node.js 22+, npm, Python 3.11+, and Xcode Command Line Tools. From the repository root:

```sh
npm install
python3 -m venv services/local-api/.venv
services/local-api/.venv/bin/pip install -r services/local-api/requirements.txt
npm run dev:desktop
```

The desktop local API binds only to `127.0.0.1:8765`.
