import unittest

from flaskr import create_app


class EnsembleTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app('config.TestingConfig')

        self.client = self.app.test_client()

        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def tearDown(self):
        """Executed after reach test"""
        # binds the app to the
        pass


actor_bad_format_error = {
    "birth_date": ["Not a valid date."],
    "gender": ["Must be one of: M, F."],
    "name": ["Not a valid string."]
}

movie_format_bad_error = {'title': ['Not a valid string.'], 'release_date': [
    'Not a valid date.']}
