import json
import unittest
from unittest.mock import patch

from flaskr.models import Actor
from tests.base import (
    EnsembleBaseTestCase,
    actor_bad_format_error,
    executive_producer_payload,
)


class EnsembleActorTestCase(EnsembleBaseTestCase):
    def setUp(self):
        super(EnsembleActorTestCase, self).setUp()
        patcher = patch(
            "flaskr.auth.verify_decode_jwt",
            return_value=executive_producer_payload,
        )
        self.addCleanup(patcher.stop)
        self.assistant_patcher = patcher.start()

    def test_cannot_get_actor_not_found(self):
        response = self.client.get("api/v1/actors/100", headers=self.headers,)
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Actor does not exist")

    def test_cannot_create_actor_with_invalid_data_format(self):
        actor = {"actor": {"name": 12, "birth_date": 12, "gender": "x"}}

        response = self.client.post(
            "api/v1/actors", data=json.dumps(actor), headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], actor_bad_format_error)
        response = self.client.post(
            "api/v1/actors",
            data=json.dumps({"name": "name"}),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 422)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "provide correct data format")

    def test_cannot_create_duplicate_actor(self):
        Actor(name="Micheal", birth_date="1990-02-25", gender="M").insert()
        actor = {
            "actor": {
                "name": "Micheal",
                "birth_date": "2005-02-02",
                "gender": "M",
            }
        }

        response = self.client.post(
            "api/v1/actors", data=json.dumps(actor), headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 409)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Actor with specified name already exists")

    def test_cannot_patch_actor_not_found(self):
        response = self.client.patch(
            "api/v1/actors/100", headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Actor does not exist")

    def test_cannot_patch_actor_bad_request_data(self):
        actor = Actor(name="Jane", birth_date="2007-02-01", gender="F")
        actor.insert()
        actor_data = {
            "actor": {"name": 8, "birth_date": "1990", "gender": "z"}
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

    def test_cannot_delete_actor_not_found(self):
        response = self.client.delete(
            "api/v1/actors/100", headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Actor does not exist")

    def test_search_actor_without_search_term(self):
        response = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"searchTerm": "james"}),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data["success"])
        self.assertDictEqual(
            data,
            {
                "success": False,
                "message": "please provide 'search_term' field",
            },
        )

    def test_search_actor_return_all_if_search_term_is_empty(self):
        num_actors = Actor.query.count()
        response = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"search_term": ""}),
            headers=self.headers,
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])
        self.assertEqual(len(data["actors"]), num_actors)

    def test_can_search_actor(self):
        actor_1 = Actor(
            name="Lucy Williams", birth_date="2008-02-01", gender="F"
        )
        actor_2 = Actor(
            name="Lucy Jenkins", birth_date="1978-04-01", gender="F"
        )
        actor_3 = Actor(name="Lucy Davis", birth_date="1999-04-01", gender="F")
        actor_4 = Actor(
            name="John Williams", birth_date="1980-05-01", gender="M"
        )

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
        self.assertEqual(
            len(data_1["actors"]), 3, "expect 3 actors named" "lucy"
        )

        response_2 = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps({"search_term": "williams"}),
            headers=self.headers,
        )
        data_2 = json.loads(response_2.data.decode())
        self.assertEqual(response_2.status_code, 200)
        self.assertTrue(data_2["success"])
        self.assertEqual(len(data_2["actors"]), 2, "expect 2 williams")

        # test_search_actor_excludes_actors_in_provided_actor_ids
        response_3 = self.client.post(
            "/api/v1/actors/search",
            data=json.dumps(
                {"search_term": "lucy", "actor_ids": [actor_1.id, actor_2.id]}
            ),
            headers=self.headers,
        )
        data_3 = json.loads(response_3.data.decode())
        self.assertEqual(response_3.status_code, 200)
        self.assertTrue(data_3["success"])
        self.assertEqual(
            len(data_3["actors"]),
            1,
            "only one since the 2 " "have been excluded",
        )
        self.assertDictEqual(data_3["actors"][0], actor_3.long())

        actor_1.delete()
        actor_2.delete()
        actor_3.delete()
        actor_4.delete()


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
