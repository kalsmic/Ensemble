import json
from unittest.mock import patch

from flaskr.models import Actor, Movie, MovieCrew
from tests.base import executive_producer_payload, EnsembleBaseTestCase


class ExecutiveDirectorTestCase(EnsembleBaseTestCase):
    def setUp(self):
        super(ExecutiveDirectorTestCase, self).setUp()
        patcher = patch(
            "flaskr.auth.verify_decode_jwt",
            return_value=executive_producer_payload,
        )
        self.addCleanup(self.get_auth_header_patcher.stop)
        self.addCleanup(patcher.stop)

        self.get_auth_header_patcher.start()
        self.producer_patcher = patcher.start()

    # get:actors
    def test_can_get_actors(self):
        num_actors = Actor.query.count()

        response = self.client.get("/api/v1/actors")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data["total"], num_actors)
        self.assertTrue(isinstance(data["actors"], list))

    # get:actors - detail
    def test_get_actor(self):
        actor = Actor(name="Lydia", birth_date="2005-05-01", gender="F")
        actor.insert()

        response = self.client.get(
            f"api/v1/actors/{actor.id}", headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        actor_dict = actor.long()
        actor_dict.update({"movie_ids": [], "movie_crew": []})
        self.assertDictEqual(data["actor"], actor_dict)

    # post:actors
    def test_can_post_actors(self):
        actor = {
            "actor": {
                "name": "Arthur",
                "birth_date": "2006-05-07",
                "gender": "F",
            }
        }

        response = self.client.post(
            "api/v1/actors", data=json.dumps(actor), headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertTrue(data["success"])
        self.assertEqual(data["actor"]["name"], actor["actor"]["name"])
        self.assertEqual(
            data["actor"]["birth_date"], actor["actor"]["birth_date"]
        )
        self.assertEqual(data["actor"]["gender"], actor["actor"]["gender"])
        self.assertIn("id", data["actor"])

        self.assertEqual(data["message"], "Actor created Successfully")

    # patch:actors
    def test_can_patch_actor(self):
        actor = Actor(name="Jeniffer", birth_date="2007-02-01", gender="F")
        actor.insert()
        actor_data = {
            "actor": {
                "name": "Jennifer Est",
                "birth_date": "2008-02-01",
                "gender": "F",
            }
        }

        response = self.client.patch(
            f"api/v1/actors/{actor.id}",
            data=json.dumps(actor_data),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        actor_dict = actor.long()
        actor_dict.update({"movie_ids": [], "movie_crew": []})
        self.assertDictEqual(data["actor"], actor_dict)

    # delete:actors
    def test_can_delete_actor(self):
        actor = Actor(name="Innocent", birth_date="2008-02-01", gender="M")
        actor.insert()
        response = self.client.delete(
            f"api/v1/actors/{actor.id}", headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data["message"], "Actor permanently deleted")
        self.assertIsNone(Actor.query.get(actor.id))

    # get: movies
    def test_can_get_movies(self):
        num_movies = Movie.query.count()

        response = self.client.get("/api/v1/movies")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data["total"], num_movies)
        self.assertTrue(isinstance(data["movies"], list))
        self.assertNotIn("movie_crew", data["movies"])
        self.assertNotIn("movie_ids", data["movies"])
        self.assertNotIn("actor_ids", data["movies"])

    # get: movies (details)
    def test_can_get_movie(self):
        movie = Movie(title="Me Myself and I", release_date="2012-01-02")
        movie.insert()

        response = self.client.get(f"/api/v1/movies/{movie.id}")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertTrue(isinstance(data["movie"], dict))
        self.assertEqual(data["movie"]["title"], movie.title)
        self.assertIn("movie_crew", data["movie"])
        self.assertNotIn("movie_ids", data["movie"])
        self.assertIn("actor_ids", data["movie"])

    # post:movies
    def test_can_post_movies(self):
        movie = {
            "movie": {"title": "My movie title", "release_date": "2019-01-01"}
        }

        response = self.client.post(
            "api/v1/movies", data=json.dumps(movie), headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertTrue(data["success"])
        self.assertEqual(data["movie"]["title"], movie["movie"]["title"])
        self.assertIn("id", data["movie"])
        self.assertEqual(data["message"], "Movie created Successfully")

    # patch: movies
    def test_can_patch_movie(self):
        movie = Movie(title="Deer Hunter", release_date="1972-01-01")
        actor = Actor(name="John Martin", gender="M", birth_date="1976-01-01")
        actor2 = Actor(name="Jacob Martin", gender="M",
                       birth_date="1976-01-01")
        actor.insert()
        actor2.insert()
        movie.insert()
        MovieCrew(actor_id=actor.id, movie_id=movie.id).insert()
        actor_id = actor.id
        actor2_id = actor2.id

        with self.client:
            invalid_movie_data = {"movie": {"title": 1, "release_date": ""}}

            response = self.client.patch(
                f"api/v1/movies/{movie.id}",
                data=json.dumps(invalid_movie_data),
                headers=self.headers,
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertFalse(data["success"])
            self.assertEqual(
                data["message"], {'release_date': ['Not a valid date.']}
            )

            valid_data = {
                "movie": {"title": "Genesis", "release_date": "1972-02-04"},
                "actor_ids": [actor2.id]
            }

            response = self.client.patch(
                f"api/v1/movies/{movie.id}",
                data=json.dumps(valid_data),
                headers=self.headers,
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 200)
            self.assertTrue(data["success"])
            self.assertTrue(data["message"], "Movie updated successfully")
            self.assertNotEqual(data["movie"]["title"], "Deer Hunter")
            self.assertEqual(
                data["movie"]["title"], valid_data["movie"]["title"]
            )
            self.assertNotIn(actor_id, data["movie"]["actor_ids"])
            self.assertIn(actor2_id, data["movie"]["actor_ids"])

    # delete: movies
    def test_can_delete_movie(self):
        movie = Movie(title="Movie to delete", release_date="2007-02-01")
        movie.insert()
        response = self.client.delete(
            f"api/v1/movies/{movie.id}", headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data["message"], "Movie deleted successfully")
        self.assertIsNone(Movie.query.get(movie.id))
