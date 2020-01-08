from functools import wraps

from flask import request
from marshmallow import ValidationError
from sqlalchemy.exc import DataError
from werkzeug.exceptions import NotFound

from flaskr.model import Actor, actor_schema


def validate_actor_id_list(actor_ids):
    try:
        invalid_actor_ids = Actor.get_invalid_actor_ids(actor_ids)
    except DataError:
        return {
                   'success': 'False',
                   'error': f'You must provide a list of integer Actor Ids'
               }, 400

    if invalid_actor_ids:
        return {
                   'success': 'False',
                   'error': f'Invalid Actor Ids {invalid_actor_ids}'
               }, 400


def validate_actor_ids(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        json_data = request.get_json(force=True)
        actor_ids = json_data.get('actor_ids', [])
        # remove duplicate ids
        try:
            actor_ids = list(set(actor_ids))
        except TypeError as err:
            return {
                       "success": False,
                       "error": {
                           "actor_ids": [f"{err}"]
                       },
                       "message": "Actor ids must be a list of numbers"
                   }, 400

        validate_actor_id_list(actor_ids)
        return func(*args, **kwargs, actor_ids=actor_ids)

    return wrapper


def contains_request_data(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'error': 'No input data provided'}, 400

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
                    "error": "Actor does not exist"
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
                       'error': 'provide correct data format',
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
                       "error": err.messages
                   }, 400

        return func(*args, **kwargs, actor=actor)

    return wrapper
