from flask import request
from flask_restful import Resource
from psycopg2._psycopg import DatabaseError

from flaskr.auth import requires_auth
from flaskr.helpers import (
    contains_request_data,
    validate_actor_ids,
    validate_actor_data,
    title_or_name_exists, id_exists)
from flaskr.models import db, Actor, actors_schema, actor_schema


class CreateListActorResource(Resource):

    @requires_auth("get:actors")
    def get(self, *args, **kwargs):
        """
            GET /actors
                - requires get:actors permission
            :returns status code 200 and json
                {"success": True, "actors":actors, ...pagination}
        """
        page = request.args.get("page", 1, type=int)

        actor_query = Actor.query.paginate(
            page=page, error_out=False, max_per_page=6
        )

        actor_items = actor_query.items
        result = dict(
            actors=actors_schema.dump(actor_items),
            total=actor_query.total,
            current_page=actor_query.page,
            per_page=actor_query.per_page,
            next_num=actor_query.next_num,
            prev_num=actor_query.prev_num,
            has_prev=actor_query.has_prev,
            has_next=actor_query.has_next,
            pages=actor_query.pages,
            success=True,
        )

        return result, 200

    @requires_auth("post:actors")
    @contains_request_data
    @validate_actor_data("post")
    @title_or_name_exists(method='post', entity='actor', field='name')
    def post(self, *args, **kwargs):
        """
            POST /actors
                creates a new actor
                requires post:actors permission

            :returns status_code 201 on success and json
                {"success": True , "actor": actor, "message": success_message }
            :returns status_code 409 if actor already exists and json
            :returns status_code 400 if any other database error occurs and json
                {"success": False, "message": error_message}
        """
        actor = kwargs["actor"]
        try:
            actor.insert()

        except DatabaseError:
            db.session.rollback()
            return (
                {
                    "success": False,
                    "message": "Error while adding an actor",
                },
                400,
            )
        finally:
            result = actor_schema.dump(actor)
            db.session.close()

        return (
            {
                "success": True,
                "message": "Actor created Successfully",
                "actor": result,
            },
            201,
        )


class RetrieveUpdateDestroyActorResource(Resource):

    @requires_auth("get:actors")
    @id_exists(entity='actor')
    def get(self, *args, **kwargs):
        """
            GET /actors/<id>
                where <id> is the existing model id
                requires get:actors permission
            :returns status_code 200 on success and json
                {"success":True, 'message":success_message, "actor": actor}
            :returns status_code 400 on failure and json
                {"success": False, "message": error_message}
        """
        actor = kwargs["actor_db_object"]

        actor = actor_schema.dump(actor)
        return {"success": True, "actor": actor, }, 200


    @requires_auth("patch:actors")
    @id_exists(entity='actor')
    @contains_request_data
    @validate_actor_data("patch")
    @title_or_name_exists(method='patch', entity='actor', field='name')
    def patch(self, *args, **kwargs):
        """
            PATCH /actors/<id>
                where <id> is the existing Actor model id
                updates the corresponding Actor row for <id>
            :returns status_code 200 on success and json
                {"success": True, "message": success_message, "actor": actor }
            :returns status_code 404 if <id> is not found and json
            :return status_code 409 if actor name already exists on another actor
                {"success": False, "message": error_message}
        """
        actor = kwargs["actor_db_object"]
        actor_data = kwargs["actor"]

        try:
            actor.name = actor_data.name
            actor.birth_date = actor_data.birth_date
            actor.gender = actor_data.gender
            actor.update()

        except DatabaseError:
            db.session.rollback()
            return (
                {
                    "success": False,
                    "message": "Error while adding actor",
                },
                400,
            )

        finally:
            result = actor_schema.dump(actor)
            db.session.close()

        return (
            {
                "success": True,
                "actor": result,
                "message": "Actor updated successfully",
            },
            200,
        )

    @requires_auth("delete:actors")
    @id_exists(entity='actor')
    def delete(self, *args, **kwargs):
        """
            DELETE /actors/<id>
                where <id> is the existing Actor model id
                requires delete:actors permission
            :returns status_code 200 on success after deleting the corresponding
                row for <id> and json {"success": True, "message": success_message}
            :returns status_code 404 error if <id> is not found
                {"success": False, "message": error_message}
        """
        actor = kwargs["actor_db_object"]
        try:
            actor.delete()
        except Exception:
            return {
                       "success": False,
                       "message": "error while deleting actor"
                   }, 400
        finally:
            db.session.close()

        return {"success": 200, "message": "Actor deleted successfully"}, 200


class SearchActorResource(Resource):
    @requires_auth("get:actors")
    @contains_request_data
    @validate_actor_ids
    def post(self, *args, **kwargs):
        """
            Post /actors/search
                requires get:actors permission
                :returns a list of actors
            :param search_term string - in request Body
            :param actor_ids in request Body,  list of Actor model ids,
            excluded from search if present
            :returns status_code 200 on success and json
                {"success":True, 'message":success_message, "actors": [{actor}],
                pagination}
            :returns status_code 400 on failure and json
                {"success": False, "message": error_message}
        """
        actor_ids = kwargs.get("actor_ids", [])
        data = kwargs["data"]

        try:
            search_term = data["search_term"]

        except KeyError as err:
            return (
                {"success": False, "message": f"please provide {err} field"},
                400,
            )

        actors_query = Actor.search_actors(
            search_term=search_term, actor_ids=actor_ids
        )

        result = actors_schema.dump(actors_query)

        return {"success": True, "actors": result}, 200
