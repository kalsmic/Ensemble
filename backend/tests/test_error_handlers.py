import json

from flaskr.views import errors
from tests.base import EnsembleTestCase


class EnsembleErrorHandlersTestCase(EnsembleTestCase):

    def test_404_return_on_not_found(self):
        response = self.client.get("api/actors")
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["message"], errors["NotFound"][
            'message'])

    def test_405(self):
        response = self.client.get("api/v1/actors/search",
                                   headers="")
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 405)
        self.assertEqual(data["message"], errors["MethodNotAllowed"][
            'message'])

