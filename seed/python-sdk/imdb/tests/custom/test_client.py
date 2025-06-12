import pytest
import pytest_httpserver
import httpx
from seed.imdb.client import ImdbClient
from seed.core.client_wrapper import SyncClientWrapper
from seed.imdb.types import Movie, MovieId


def test_get_movie(httpserver):
    movie_id = "xyz789"
    movie_data = {"id": movie_id, "title": "The Matrix", "rating": 5.0}
    httpserver.expect_request(f"/imdb/movies/{movie_id}", method="GET").respond_with_json(movie_data)

    client_wrapper = SyncClientWrapper(
        base_url=httpserver.url_for("/imdb"),
        httpx_client=httpx.Client(),
        token="dummy-token"
    )
    client = ImdbClient(client_wrapper=client_wrapper)
    movie = client.get_movie(movie_id=movie_id)
    assert movie.id == movie_id
    assert movie.title == "The Matrix"
    assert movie.rating == 5.0

def test_create_movie(httpserver):
    movie_id = "xyz789"
    request_data = {"title": "The Matrix", "rating": 5.0}
    httpserver.expect_request("/imdb/movies/create-movie", method="POST", json=request_data).respond_with_json(movie_id)

    client_wrapper = SyncClientWrapper(
        base_url=httpserver.url_for("/imdb"),
        httpx_client=httpx.Client(),
        token="dummy-token"
    )
    client = ImdbClient(client_wrapper=client_wrapper)
    returned_id = client.create_movie(title=request_data["title"], rating=request_data["rating"])
    assert returned_id == movie_id
