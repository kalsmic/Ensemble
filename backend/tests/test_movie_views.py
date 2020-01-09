import json
import unittest
from pprint import pprint as print

from flaskr.model import Movie, Actor
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
        print(data)
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


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
