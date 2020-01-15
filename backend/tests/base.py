import json
import unittest
from functools import wraps
from unittest.mock import patch

from flaskr import create_app
from flaskr.models import db

casting_assistant_payload = {"permissions": ["get:actors", "get:movies"]}
casting_director_payload = {
    "permissions": [
        "get:actors",
        "get:movies",
        "post:actors",
        "delete:actors",
        "patch:actors",
        "patch:movies",
    ]
}
executive_producer_payload = {
    "permissions": [
        "get:actors",
        "get:movies",
        "post:actors",
        "delete:actors",
        "patch:actors",
        "patch:movies",
        "post:movies",
        "delete:movies",
    ]
}
permission_not_found_message = "Permission Not found"


def mock_requires_auth(permission=""):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            payload = {"permissions": [permission]}
            return f(payload, *args, **kwargs)

        return wrapper

    return requires_auth_decorator


def mock_get_auth_token_header():
    return "token"


class EnsembleBaseTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        self.get_auth_header_patcher = patch(
            "flaskr.auth.get_token_auth_header",
            return_value=mock_get_auth_token_header,
        )
        # self.addCleanup(patcher.stop)
        # self.get_auth_header_patcher = patcher.start()

        """Define test variables and initialize app."""
        self.app = create_app("config.TestingConfig")
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        self.client = self.app.test_client()

        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer Token",
        }

    def make_permission_error_assertions(self, response):
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 403)
        self.assertNotEqual(response.status_code, 200)

        self.assertTrue(data["message"], permission_not_found_message)

    def tearDown(self):
        """Executed after reach test"""
        # binds the app to the
        db.session.remove()
        db.drop_all()
        self.app_context.pop()


actor_bad_format_error = {
    "birth_date": ["Not a valid date."],
    "gender": ["Must be one of: M, F."],
    "name": ["Not a valid string."],
}

movie_format_bad_error = {
    "release_date": ["Not a valid date."],
}

movie_actor_data = {
    "actor": {"name": "Kalsmic P", "birth_date": "2006-05-07", "gender": "M"}
}

movie_data = {
    "movie": {"title": "My dummy movie", "release_date": "2006-05-07"}
}
