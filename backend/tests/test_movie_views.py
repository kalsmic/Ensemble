import json
import unittest

from flaskr.models import Movie, Actor, MovieCrew
from tests.base import EnsembleTestCase, movie_format_bad_error


class EnsembleMovieTestCase(EnsembleTestCase):

    def test_get_movies(self):
        num_movies = Movie.query.count()

        response = self.client.get("/api/v1/movies")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data['total'], num_movies)
        self.assertTrue(isinstance(data["movies"], list))
        self.assertNotIn('movie_crew', data['movies'])
        self.assertNotIn('movie_ids', data['movies'])
        self.assertNotIn('actor_ids', data['movies'])

    def test_get_movie(self):
        movie = Movie(title="Me Myself and I", release_date="2012-01-02")
        movie.insert()

        response = self.client.get(f"/api/v1/movies/{movie.id}")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertTrue(isinstance(data["movie"], dict))
        self.assertEqual(data['movie']['title'], movie.title)
        self.assertIn('movie_crew', data['movie'])
        self.assertNotIn('movie_ids', data['movie'])
        self.assertIn('actor_ids', data['movie'])

    def test_create_movie_with_invalid_movie_data_format(self):
        movie = {
            "movie": {"title": 12,
                      "release_date": 12,
                      }
        }

        response = self.client.post(
            "api/v1/movies",
            data=json.dumps(movie),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertDictEqual(data["error"], movie_format_bad_error)

    def test_create_movie_with_invalid_movie_actor_ids(self):
        movie = {
            "movie": {"title": "The Exodus",
                      "release_date": "2019-01-01"
                      },
            "actor_ids": [{"id": 1}, 1]

        }

        response = self.client.post(
            "api/v1/movies",
            data=json.dumps(movie),
            headers=self.headers,
        )

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode())

        self.assertFalse(data['success'])
        self.assertDictEqual(data["error"], {
            'actor_ids': 'Actor ids must be a list of integers'})

    def test_create_movie_with_valid__actor_ids(self):
        actor1 = Actor(name='Mubarak', birth_date='1980-02-03', gender="M")
        actor2 = Actor(name='Emmanuel', birth_date='19780-02-03', gender="M")
        actor1.insert()
        actor2.insert()
        # we should also expect the duplicate actor ids to be are removed
        movie = {
            "movie": {
                "title": 'The Exorcist -2',
                "release_date": '2006-02-02'
            },
            "actor_ids": [actor1.id, actor2.id, actor2.id, actor1.id]
        }

        response = self.client.post(
            "api/v1/movies",
            data=json.dumps(movie),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertTrue(data['success'])
        self.assertTrue(data['message'], 'Movie created Successfully')
        actor_ids = data['movie']['actor_ids']
        self.assertIn(actor1.id, actor_ids)
        self.assertIn(actor2.id, actor_ids)

    def test_create_duplicate_movie(self):
        Movie(title="my duplicate", release_date="2019-02-01").insert()
        movie = {
            "movie": {
                "title": 'my duplicate',
                "release_date": '2006-02-02'
            }
        }

        response = self.client.post(
            "api/v1/movies",
            data=json.dumps(movie),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 409)
        self.assertFalse(data['success'])
        self.assertDictEqual(data,
                             {
                                 "success": False,
                                 "error": "Movie already exists"
                             })

    def test_update_movie(self):
        movie = Movie(title="Deer Hunter", release_date="1972-01-01")
        actor = Actor(name="John Martin", gender="M", birth_date="1976-01-01")
        actor.insert()
        movie.insert()
        MovieCrew(actor_id=actor.id, movie_id=movie.id).insert()
        actor_id = actor.id

        with self.client:
            invalid_movie_data = {"movie": {"title": 1, "release_date": ""}
                                  }

            response = self.client.patch(
                f"api/v1/movies/{movie.id}",
                data=json.dumps(invalid_movie_data),
                headers=self.headers
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertFalse(data["success"])
            self.assertEqual(data["error"],
                             {'release_date': ['Not a valid date.'],
                              'title': ['Not a valid string.']})

            valid_data = {"movie": {"title": "Genesis", "release_date":
                "1972-02-04"}}

            response = self.client.patch(
                f"api/v1/movies/{movie.id}",
                data=json.dumps(valid_data),
                headers=self.headers,
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 200)
            self.assertTrue(data['success'])
            self.assertTrue(data['message'], 'Movie updated successfully')
            self.assertNotEqual(data['movie']["title"], "Deer Hunter")
            self.assertEqual(data['movie']["title"], valid_data['movie'][
                'title'])
            self.assertIn(actor_id, data["movie"]["actor_ids"])


    def test_delete_movie_not_found(self):
        response = self.client.delete(
            "api/v1/movies/100",
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["error"], 'Movie does not exist')

    def test_delete_actor(self):
        movie = Movie(title='Movie to delete', release_date='2007-02-01')
        movie.insert()
        response = self.client.delete(
            f"api/v1/movies/{movie.id}",
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data["message"], "Movie deleted successfully")
        self.assertIsNone(Movie.query.get(movie.id))

    def test_get_movie_actors(self):
        movie = Movie(title="Purpose", release_date="1972-01-01")
        actor1 = Actor(name="Peter Murray", gender="M",
                       birth_date="1976-01-01")
        actor2 = Actor(name="John Stephen", gender="M", birth_date="1976-01-01")
        actor3 = Actor(name="Harrison Luke", gender="M",
                       birth_date="1976-01-01")

        actor1.insert()
        actor2.insert()
        actor3.insert()
        movie.insert()
        movie.add_movie_actors([actor1.id, actor2.id, actor3.id])

        response = self.client.get(f"/api/v1/movies/{movie.id}/actors")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(len(data['actors']), 3)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
