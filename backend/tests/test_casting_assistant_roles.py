import json
from unittest.mock import patch

from tests.base import casting_assistant_payload, EnsembleBaseTestCase

permission_not_found_message = "Permission Not found"


class CastingAssistantTestCase(EnsembleBaseTestCase):
    def setUp(self):
        super(CastingAssistantTestCase, self).setUp()
        patcher = patch(
            "flaskr.auth.verify_decode_jwt",
            return_value=casting_assistant_payload,
        )
        self.addCleanup(patcher.stop)
        self.assistant_patcher = patcher.start()

    # get: actors
    def test_can_get_actors(self):
        response = self.client.get("/api/v1/actors")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.status_code, 403)
        self.assertTrue(data["success"])
        self.assertTrue(isinstance(data["actors"], list))

    # get: movies
    def test_can_get_movies(self):
        response = self.client.get("/api/v1/movies")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.status_code, 403)
        self.assertTrue(data["success"])
        self.assertTrue(isinstance(data["movies"], list))

    # post: actors
    def test_cannot_post_actors(self):
        response = self.client.post("api/v1/actors", headers=self.headers,)
        self.make_permission_error_assertions(response)

    # patch: actors
    def test__not_patch_actors(self):
        response = self.client.patch("api/v1/actors/1", headers=self.headers,)
        self.make_permission_error_assertions(response)

    # patch: movies
    def test__not_patch_movies(self):
        response = self.client.patch("api/v1/movies/1", headers=self.headers,)
        self.make_permission_error_assertions(response)

    # post: movies
    def test__not_post_movies(self):
        response = self.client.post("api/v1/movies", headers=self.headers,)
        self.make_permission_error_assertions(response)

    # delete: actors
    def test__not_delete_actors(self):
        response = self.client.delete("api/v1/actors/1", headers=self.headers)
        self.make_permission_error_assertions(response)

    # delete: movies
    def test__not_delete_movies(self):
        response = self.client.delete("api/v1/movies/1", headers=self.headers)
        self.make_permission_error_assertions(response)
