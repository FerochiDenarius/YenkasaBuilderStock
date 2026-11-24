"""Build the local FastAPI service as an installer-ready executable."""

from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
SERVICE = ROOT / 'services' / 'local-api'
OUTPUT = ROOT / 'apps' / 'desktop' / 'packaging' / 'local-api'
PYINSTALLER = SERVICE / ('.venv/Scripts/pyinstaller.exe' if sys.platform == 'win32' else '.venv/bin/pyinstaller')


def main() -> None:
    if not PYINSTALLER.exists():
        raise SystemExit(
            'PyInstaller is not installed. Run: '
            'services/local-api/.venv/bin/pip install -r services/local-api/requirements-build.txt'
        )
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)
    work = Path(tempfile.gettempdir()) / 'ykbuildstock-pyinstaller'
    command = [
        str(PYINSTALLER), '--noconfirm', '--clean', '--onefile', '--name', 'local-api',
        '--distpath', str(OUTPUT), '--workpath', str(work), '--specpath', str(work),
        '--collect-submodules', 'uvicorn', '--collect-submodules', 'fastapi',
        '--collect-submodules', 'sqlalchemy', '--collect-submodules', 'pydantic',
        str(SERVICE / 'entrypoint.py'),
    ]
    subprocess.run(command, cwd=SERVICE, check=True)
    print(OUTPUT / 'local-api')


if __name__ == '__main__':
    main()
