from contextlib import contextmanager
from typing import Dict, Optional
import json
import pytest_httpserver

class Request:
    def __init__(self, path: str, method: str, query: Optional[str] = None, headers: Optional[Dict[str, str]] = None, body: Optional[str] = None, json_body: Optional[dict] = None):
        self.path = path
        self.method = method
        self.query = query
        self.headers = headers or {}
        self.body = body
        self.json_body = json_body

class Response:
    def __init__(self, headers: Optional[Dict[str, str]] = None, body: Optional[str] = None, json_body: Optional[dict] = None, status: int = 200):
        self.headers = headers or {}
        self.body = body
        self.json_body = json_body
        self.status = status

@contextmanager
def server(httpserver, request: Request, response: Response):
    # Build the full path with query if present
    full_path = request.path
    if request.query:
        full_path += f"?{request.query}"

    matcher = httpserver.expect_request(full_path, method=request.method)
    if request.json_body is not None:
        matcher = matcher.with_data(json.dumps(request.json_body))
        matcher = matcher.with_headers({**request.headers, "Content-Type": "application/json"})
    elif request.body is not None:
        matcher = matcher.with_data(request.body)
    for k, v in request.headers.items():
        matcher = matcher.with_headers({k: v})
    if response.json_body is not None:
        matcher.respond_with_json(response.json_body, status=response.status, headers=response.headers)
    else:
        matcher.respond_with_data(response.body or "", status=response.status, headers=response.headers)
    yield httpserver 