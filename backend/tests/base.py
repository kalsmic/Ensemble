import unittest
from functools import wraps
from unittest.mock import patch

from flaskr import create_app
from flaskr.models import db

permissions = [
    "get:actors",
    "get:movies",
    "post:actors",
    "delete:actors",
    "patch:actors",
    "patch:movies",
    "post:movies",
    "delete:movies"
]

def mock_requires_auth(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            payload = {"permissions": permission}
            return f(payload, *args, **kwargs)

        return wrapper

    return requires_auth_decorator


patch('flaskr.auth.requires_auth', mock_requires_auth).start()
class EnsembleTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app('config.TestingConfig')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        self.client = self.app.test_client()

        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer Token"
        }

    def tearDown(self):
        """Executed after reach test"""
        # binds the app to the
        db.session.remove()
        db.drop_all()
        self.app_context.pop()



actor_bad_format_error = {
    "birth_date": ["Not a valid date."],
    "gender": ["Must be one of: M, F."],
    "name": ["Not a valid string."]
}

movie_format_bad_error = {'title': ['Not a valid string.'], 'release_date': [
    'Not a valid date.']}
