import os

import uvicorn
from app.main import app


if __name__ == '__main__':
    uvicorn.run(
        app,
        host=os.getenv('LOCAL_API_HOST', '127.0.0.1'),
        port=int(os.getenv('LOCAL_API_PORT', '8765')),
    )
