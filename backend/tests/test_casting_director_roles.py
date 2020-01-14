import json
from unittest.mock import patch

from flaskr.models import Actor
from tests.base import (
    casting_director_payload,
    EnsembleBaseTestCase,
    movie_actor_data,
    movie_data,
)


class CastingDirectorTestCase(EnsembleBaseTestCase):
    def setUp(self):
        super(CastingDirectorTestCase, self).setUp()
        patcher = patch(
            "flaskr.auth.verify_decode_jwt",
            return_value=casting_director_payload,
        )
        self.addCleanup(self.get_auth_header_patcher.stop)
        self.addCleanup(patcher.stop)

        self.get_auth_header_patcher.start()
        self.director_patcher = patcher.start()

    # get:actors
    def test_get_actors(self):
        response = self.client.get("/api/v1/actors")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.status_code, 403)
        self.assertTrue(data["success"])
        self.assertTrue(isinstance(data["actors"], list))

    # get: movies
    def test_get_movies(self):
        response = self.client.get("/api/v1/movies")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.status_code, 403)
        self.assertTrue(data["success"])
        self.assertTrue(isinstance(data["movies"], list))

    # post: actors
    def test_create_actors(self):
        response = self.client.post(
            "api/v1/actors",
            data=json.dumps(movie_actor_data),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(response.status_code, 403)
        self.assertEqual(
            data["actor"]["name"], movie_actor_data["actor"]["name"]
        )
        self.assertEqual(
            data["actor"]["birth_date"],
            movie_actor_data["actor"]["birth_date"],
        )
        self.assertEqual(
            data["actor"]["gender"], movie_actor_data["actor"]["gender"]
        )
        self.assertEqual(data["message"], "Actor created Successfully")

    # patch: actors
    def test_patch_actor(self):
        actor = Actor(name="Micheal", birth_date="1990-02-25", gender="M")
        actor.insert()

        response = self.client.patch(
            f"api/v1/actors/{actor.id}",
            data=json.dumps(movie_actor_data),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        actor_dict = actor.long()
        actor_dict.update({"movie_ids": [], "movie_crew": []})

        self.assertEqual(data["message"], "Actor updated successfully")
        self.assertDictEqual(data["actor"], actor_dict)
        self.assertEqual(
            data["actor"]["name"], movie_actor_data["actor"]["name"]
        )

    # delete: actors
    def test_can_delete_actor(self):
        actor = Actor(name="Jones", birth_date="2008-02-01", gender="M")
        actor.insert()
        response = self.client.delete(
            f"api/v1/actors/{actor.id}", headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data["message"], "Actor deleted successfully")
        self.assertIsNone(Actor.query.get(actor.id))

    # post: movies
    def test_cannot_post_movies(self):
        response = self.client.post(
            "api/v1/movies", headers=self.headers, data=json.dumps(movie_data)
        )
        self.make_permission_error_assertions(response)

    # delete: movies
    def test_cannot_delete_movie(self):
        response = self.client.delete(
            f"api/v1/movies/1", headers=self.headers,
        )

        self.make_permission_error_assertions(response)
