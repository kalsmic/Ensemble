import json
import unittest
from unittest.mock import patch

from flaskr.models import Movie, Actor
from tests.base import (
    EnsembleBaseTestCase,
    movie_format_bad_error,
    executive_producer_payload,
)


class EnsembleMovieTestCase(EnsembleBaseTestCase):
    def setUp(self):
        super(EnsembleMovieTestCase, self).setUp()
        patcher = patch(
            "flaskr.auth.verify_decode_jwt",
            return_value=executive_producer_payload,
        )
        self.addCleanup(self.get_auth_header_patcher.stop)
        self.addCleanup(patcher.stop)

        self.get_auth_header_patcher.start()
        self.assistant_patcher = patcher.start()

    def test_cannot_create_movie_with_invalid_movie_data_format(self):
        movie = {"movie": {"title": '', "release_date": 12, }}

        response = self.client.post(
            "api/v1/movies", data=json.dumps(movie), headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["success"])
        self.assertDictEqual(data["message"], movie_format_bad_error)

        response = self.client.post(
            "api/v1/movies",
            data=json.dumps(
                {"title": "my movie", "release_date": "2019-01-02"}
            ),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "please provide 'movie' field")

    def test_cannot_create_movie_with_invalid_movie_actor_ids(self):
        movie = {
            "movie": {"title": "The Exodus", "release_date": "2019-01-01"},
            "actor_ids": [{"id": 1}, 1],
        }

        response = self.client.post(
            "api/v1/movies", data=json.dumps(movie), headers=self.headers,
        )

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode())

        self.assertFalse(data["success"])
        self.assertDictEqual(
            data["message"],
            {"actor_ids": "Actor ids must be a list of integers"},
        )

    def test_cannot_post_movie_with_non_existent_actor_ids(self):
        movie = {
            "movie": {"title": "The Exodus", "release_date": "2019-01-01"},
            "actor_ids": [700, ],
        }

        response = self.client.post(
            "api/v1/movies", data=json.dumps(movie), headers=self.headers,
        )

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode())

        # self.assertFalse(data['success'])
        self.assertEqual(data["message"], "Actors with Ids [700] do not exist")

    def test_can_create_movie_with_valid__actor_ids(self):
        actor1 = Actor(name="Mubarak", birth_date="1980-02-03", gender="M")
        actor2 = Actor(name="Emmanuel", birth_date="19780-02-03", gender="M")
        actor1.insert()
        actor2.insert()
        # we should also expect the duplicate actor ids to be are removed
        movie = {
            "movie": {
                "title": "The Exorcist -2",
                "release_date": "2006-02-02",
            },
            "actor_ids": [actor1.id, actor2.id, actor2.id, actor1.id],
        }

        response = self.client.post(
            "api/v1/movies", data=json.dumps(movie), headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertTrue(data["success"])
        self.assertTrue(data["message"], "Movie created Successfully")
        actor_ids = data["movie"]["actor_ids"]
        self.assertIn(actor1.id, actor_ids)
        self.assertIn(actor2.id, actor_ids)

    def test_cannot_create_duplicate_movie(self):
        Movie(title="my duplicate", release_date="2019-02-01").insert()
        movie = {
            "movie": {"title": "my duplicate", "release_date": "2006-02-02"}
        }

        response = self.client.post(
            "api/v1/movies", data=json.dumps(movie), headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 409)
        self.assertFalse(data["success"])
        self.assertDictEqual(
            data, {"success": False,
                   "message": "Movie with specified title already exists"}
        )

    def test_cannot_delete_movie_not_found(self):
        response = self.client.delete(
            "api/v1/movies/100", headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Movie does not exist")

    # get: movies
    def test_can_get_movie_actors(self):
        movie = Movie(title="Purpose", release_date="1972-01-01")
        actor1 = Actor(
            name="Peter Murray", gender="M", birth_date="1976-01-01"
        )
        actor2 = Actor(
            name="John Stephen", gender="M", birth_date="1976-01-01"
        )
        actor3 = Actor(
            name="Harrison Luke", gender="M", birth_date="1976-01-01"
        )

        actor1.insert()
        actor2.insert()
        actor3.insert()
        movie.insert()
        movie.add_movie_actors([actor1.id, actor2.id, actor3.id])

        response = self.client.get(f"/api/v1/movies/{movie.id}/actors")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(len(data["actors"]), 3)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
