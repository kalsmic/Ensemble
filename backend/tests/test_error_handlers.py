import json

from werkzeug.exceptions import Forbidden

from flaskr.auth import check_permissions
from flaskr.views import errors
from tests.base import EnsembleBaseTestCase


class EnsembleErrorHandlersTestCase(EnsembleBaseTestCase):
    def test_welcome_route(self):
        response = self.client.get("/")
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "welcome to Ensemble")

    def test_404_return_on_not_found(self):
        response = self.client.get("api/actors")
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["message"], errors["NotFound"]["message"])

    def test_405(self):
        response = self.client.get("api/v1/actors/search", headers="")
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 405)
        self.assertEqual(
            data["message"], errors["MethodNotAllowed"]["message"]
        )

    def test_500_internal_server_error(self):
        headers = {'Authorization': 'Bearer z'}
        response = self.client.get("api/v1/actors", headers=headers)
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 500)
        self.assertEqual(data['message'], 'Internal Server Error')

    def test_no_authorization_header(self):
        response = self.client.get("api/v1/actors")
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            data["message"], "Authorization header is expected"
        )

    def test_bad_format_header_auth(self):
        headers = {'Authorization': 'x'}
        response = self.client.get("api/v1/actors", headers=headers)
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            data["message"],
            "Authorization header must be in the format Bearer token"
        )

    def test_bearer_not_in_auth_header(self):
        headers = {'Authorization': 'x z'}
        response = self.client.get("api/v1/actors", headers=headers)
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            data["message"], "Authorization header must start with Bearer"
        )

    def test_403_error(self):
        with self.assertRaises(Forbidden):
            check_permissions(["get:movies"], {})


