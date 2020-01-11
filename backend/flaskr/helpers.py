from functools import wraps

from flask import request
from marshmallow import ValidationError
from werkzeug.exceptions import NotFound

from flaskr.models import Actor, actor_schema, movie_schema, Movie
from flaskr.models import actor_ids_schema


def validate_actor_ids(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        json_data = request.get_json(force=True)

        if 'actor_ids' not in json_data:
            return func(*args, **kwargs, actor_ids_present=False)

        actor_ids = json_data.get('actor_ids', [])

        try:
            actor_ids = actor_ids_schema.load({'ids': actor_ids})

            # Remove duplicate ids
            actor_ids = list(set(actor_ids.get('ids')))

        except ValidationError:
            return {
                       "success": False,
                       "message": {
                           "actor_ids": "Actor ids must be a list of integers"}
                   }, 400

        invalid_actor_ids = Actor.get_invalid_actor_ids(actor_ids)

        if invalid_actor_ids:
            return {
                       'success': 'False',
                       'message': f'Actors with Ids {invalid_actor_ids} do '
                                  f'not exist'
                   }, 400

        return func(*args, **kwargs, actor_ids=actor_ids, actor_ids_present
        =True)

    return wrapper


def contains_request_data(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            json_data = request.get_json(force=True)
            if not json_data:
                return {'success': False,
                        'message': 'No input data provided'}, 400
        except Exception as err:
            return {"success": False,
                    "message": "Please Provide valid json data format"}, 400

        return func(*args, **kwargs, data=json_data)

    return wrapper


def actor_id_exists(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        actor_id = kwargs['actor_id']

        try:
            actor_object = Actor.query.get_or_404(actor_id)
        except NotFound:
            return {"success": False,
                    "message": "Actor does not exist"
                    }, 404
        return func(*args, **kwargs, actor_object=actor_object)

    return wrapper


def validate_actor_data(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        json_data = request.get_json(force=True)

        try:
            actor_data = json_data['actor']
        except KeyError:
            return {
                       'success': False,
                       'message': 'provide correct data format',
                       'format': '{actor: {name: string, birth_date: YYYY-MM-DD, gender: '
                                 'one of M or F}'
                   }, 422

        actor = {
            'name': actor_data.get('name'),
            'birth_date': actor_data.get('birth_date'),
            'gender': actor_data.get('gender')
        }
        try:
            actor_schema.load(actor)
        except ValidationError as err:
            # Show Errors if validation fails
            return {
                       "success": False,
                       "message": err.messages
                   }, 400

        return func(*args, **kwargs, actor=actor)

    return wrapper


def validate_movie_data(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        json_data = request.get_json(force=True)

        try:
            movie_data = json_data['movie']
            title = movie_data['title']
            release_date = movie_data['release_date']

        except KeyError as err:
            return {
                       'success': False,
                       "message": f"please provide {err} field",
                       'format': "{'movie': { 'title': 'string', 'release_date':"
                                 "'YYYY-MM-DD' } }"
                   }, 400

        try:
            movie = movie_schema.load(
                {'title': title, 'release_date': release_date})
        except ValidationError as err:
            # Show Errors if validation fails
            return {
                       "success": False,
                       "message": err.messages
                   }, 400

        return func(*args, **kwargs, movie=movie)

    return wrapper


def movie_id_exists(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        movie_id = kwargs['movie_id']

        try:
            movie_object = Movie.query.get_or_404(movie_id)
        except NotFound:
            return {"success": False,
                    "message": "Movie does not exist"
                    }, 404
        return func(*args, **kwargs, movie_object=movie_object)

    return wrapper
