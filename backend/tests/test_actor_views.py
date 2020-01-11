import json
import unittest

from flaskr.models import Actor
from tests.base import EnsembleTestCase, actor_bad_format_error

class EnsembleActorTestCase(EnsembleTestCase):

    def test_get_actors(self):
        num_actors = Actor.query.count()

        response = self.client.get("/api/v1/actors")

        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data['total'], num_actors)
        self.assertTrue(isinstance(data["actors"], list))

    def test_create_actor_with_invalid_data_format(self):
        actor = {
            "actor": {"name": 12,
                      "birth_date": 12,
                      "gender": 'x'}
        }

        response = self.client.post(
            "api/v1/actors",
            data=json.dumps(actor),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertEqual(data["message"], actor_bad_format_error)

    def test_create_duplicate_actor(self):
        Actor(name='Micheal', birth_date="1990-02-25", gender='M').insert()
        actor = {
            "actor": {
                "name": 'Micheal',
                "birth_date": "2005-02-02",
                "gender": 'M'
            }
        }

        response = self.client.post(
            "api/v1/actors",
            data=json.dumps(actor),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 409)
        self.assertFalse(data['success'])
        self.assertEqual(data["message"], 'Actor already exists')

    def test_create_actors(self):
        actor = {
            "actor": {
                "name": 'Arthur',
                "birth_date": "2006-05-07",
                "gender": 'F'
            }
        }

        response = self.client.post(
            "api/v1/actors",
            data=json.dumps(actor),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertTrue(data["success"])
        self.assertEqual(data["actor"]['name'], actor['actor']['name'])
        self.assertEqual(data["actor"]['birth_date'],
                         actor['actor']['birth_date'])
        self.assertEqual(data["actor"]['gender'], actor['actor']['gender'])
        self.assertIn('id', data['actor'])

        self.assertEqual(data["message"], 'Actor created Successfully')

    def test_get_actor_not_found(self):
        response = self.client.get(
            "api/v1/actors/100",
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], 'Actor does not exist')

    def test_get_actor(self):
        actor = Actor(name='Lydia', birth_date='2005-05-01', gender='F')
        actor.insert()

        response = self.client.get(
            f"api/v1/actors/{actor.id}",
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        actor_dict = actor.long()
        actor_dict.update({'movie_ids': [], 'movie_crew': []})
        self.assertDictEqual(data["actor"], actor_dict)

    def test_patch_actor_not_found(self):
        actor_data = {
            "actor": {
                "name": 8,
                "birth_date": 'b',
                "gender": 'z'
            }
        }
        response = self.client.patch(
            "api/v1/actors/100",
            data=json.dumps(actor_data),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], 'Actor does not exist')

    def test_patch_actor_bad_request_data(self):
        actor = Actor(name='Jane', birth_date='2007-02-01', gender='F')
        actor.insert()
        actor_data = {"actor": {
            "name": 8,
            "birth_date": '1990',
            "gender": 'z'
        }

        }

        response = self.client.patch(
            f"api/v1/actors/{actor.id}",
            data=json.dumps(actor_data),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["success"])
        self.assertDictEqual(data["message"], actor_bad_format_error)

    def test_patch_actor(self):
        actor = Actor(name='Jeniffer', birth_date='2007-02-01', gender='F')
        actor.insert()
        actor_data = {"actor": {

            "name": "Jennifer Est",
            "birth_date": '2008-02-01',
            "gender": 'F'
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
        actor_dict.update({'movie_ids': [], 'movie_crew': []})
        self.assertDictEqual(data['actor'], actor_dict)

    def test_delete_actor_not_found(self):
        response = self.client.delete(
            "api/v1/actors/100",
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], 'Actor does not exist')

    def test_delete_actor(self):
        actor = Actor(name='Innocent', birth_date='2008-02-01', gender='M')
        actor.insert()
        response = self.client.delete(
            f"api/v1/actors/{actor.id}",
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(data["message"], "Actor deleted successfully")
        self.assertIsNone(Actor.query.get(actor.id))

    def test_search_actor_without_search_term(self):
        response = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"searchTerm": "james"}),
            headers=self.headers
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["success"])
        self.assertDictEqual(data, {
            'success': False,
            "message": "please provide 'search_term' field"
        })

    def test_search_actor_return_all_if_search_term_is_empty(
            self):
        num_actors = Actor.query.count()
        response = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"search_term": ""}),
            headers=self.headers
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(len(data['actors']), num_actors)

    def test_search_actor(self):
        actor_1 = Actor(name='Lucy Williams', birth_date='2008-02-01',
                        gender='F')
        actor_2 = Actor(name='Lucy Jenkins', birth_date='1978-04-01',
                        gender='F')
        actor_3 = Actor(name='Lucy Davis', birth_date='1999-04-01',
                        gender='F')
        actor_4 = Actor(name='John Williams', birth_date='1980-05-01',
                        gender='M')

        actor_1.insert()
        actor_2.insert()
        actor_3.insert()
        actor_4.insert()

        # test_search_actor_filters_correctly
        response_1 = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"search_term": "lucy"}),
            headers=self.headers,
        )
        data_1 = json.loads(response_1.data.decode())
        self.assertEqual(response_1.status_code, 200)
        self.assertTrue(data_1["success"])
        self.assertEqual(len(data_1['actors']), 3, 'expect 3 actors named'
                                                   'lucy')

        response_2 = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"search_term": "williams"}),
            headers=self.headers,
        )
        data_2 = json.loads(response_2.data.decode())
        self.assertEqual(response_2.status_code, 200)
        self.assertTrue(data_2["success"])
        self.assertEqual(len(data_2['actors']), 2, 'expect 2 williams')

        # test_search_actor_excludes_actors_in_provided_actor_ids
        response_3 = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"search_term": "lucy", 'actor_ids': [
                actor_1.id, actor_2.id]}),
            headers=self.headers,
        )
        data_3 = json.loads(response_3.data.decode())
        self.assertEqual(response_3.status_code, 200)
        self.assertTrue(data_3["success"])
        self.assertEqual(len(data_3['actors']), 1, 'only one since the 2 '
                                                   'have been excluded')
        self.assertDictEqual(data_3['actors'][0], actor_3.long())

        actor_1.delete()
        actor_2.delete()
        actor_3.delete()
        actor_4.delete()


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
