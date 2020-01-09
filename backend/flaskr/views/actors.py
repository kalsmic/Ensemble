from flask import request
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import NotFound

from flaskr.auth import requires_auth
from flaskr.helpers import contains_request_data, validate_actor_ids, \
    actor_id_exists, validate_actor_data
from flaskr.models import db, Actor, actors_schema, actor_schema

actor_not_found_response = {'success': False,
                            'error': 'Actor does not exist'}, 404


class CreateListActorResource(Resource):

    @requires_auth('get:actors')
    def get(self, *args, **kwargs):
        page = request.args.get("page", 1, type=int)

        actor_query = Actor.query.paginate(page=page, error_out=False,
                                           max_per_page=6)

        actor_items = actor_query.items
        result = dict(actors=actors_schema.dump(actor_items),
                      total=actor_query.total,
                      current_page=actor_query.page,
                      per_page=actor_query.per_page,
                      next_num=actor_query.next_num,
                      prev_num=actor_query.prev_num,
                      has_prev=actor_query.has_prev,
                      has_next=actor_query.has_next,
                      pages=actor_query.pages,
                      success=True)

        return result, 200

    @requires_auth('post:actors')
    @contains_request_data
    @validate_actor_data
    def post(self, *args, **kwargs):
        actor_data = kwargs['actor']

        try:
            actor = Actor(**actor_data)
            actor.insert()

        except IntegrityError as err:
            # Show Error if Actor with specified name already exists
            db.session.rollback()
            return {
                       "success": False,
                       "error": 'Actor already exists'
                   }, 409

        result = actor_schema.dump(actor)

        return {
                   "success": True,
                   'message': 'Actor created Successfully',
                   'actor': result
               }, 201


class RetrieveUpdateDestroyActorResource(Resource):
    @requires_auth('get:actors')
    @actor_id_exists
    def get(self, *args, **kwargs):
        actor = kwargs['actor_object']

        actor = actor_schema.dump(actor)
        return {
                   "success": True,
                   "actor": actor,
               }, 200

    @requires_auth('patch:actors')
    @contains_request_data
    @actor_id_exists
    @validate_actor_data
    def patch(self, *args, **kwargs):
        actor = kwargs['actor_object']
        actor_data = kwargs['actor']

        try:
            actor.name = actor_data['name']
            actor.birth_date = actor_data['birth_date']
            actor.gender = actor_data['gender']

            db.session.commit()
        except IntegrityError as err:
            # Show Error if Actor with specified name already exists
            return {
                       "success": False,
                       "error": 'Actor already exists'
                   }, 409

        result = actor_schema.dump(actor)

        return {"success": True, 'actor': result,
                "message": "Actor updated successfully"}, 200

    @requires_auth('delete:actors')
    @actor_id_exists
    def delete(self, *args, **kwargs):
        actor_id = kwargs['actor_id']
        try:
            actor = Actor.query.get_or_404(actor_id)
        except NotFound:
            return actor_not_found_response

        actor.delete()

        return {"success": 200,
                "message": "Actor deleted successfully"}, 200


class SearchActorResource(Resource):

    @requires_auth('get:actors')
    @contains_request_data
    @validate_actor_ids
    def post(self, *args, **kwargs):
        actor_ids = kwargs.get('actor_ids', [])
        data = kwargs['data']

        try:
            search_term = data['search_term']

        except KeyError as err:
            return {
                       "success": False,
                       "error": f"please provide {err} field"
                   }, 400

        actors_query = Actor.search_actors(search_term=search_term,
                                           actor_ids=actor_ids)

        result = actors_schema.dump(actors_query)

        return {"success": True, "actors": result}, 200
