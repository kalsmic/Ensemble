from functools import wraps

from flask import request
from marshmallow import ValidationError
from werkzeug.exceptions import NotFound

from flaskr.models import Actor, actor_schema, movie_schema, Movie
from flaskr.models import actor_ids_schema

entities = {
    "actor": {
        "model": Actor,
        "unique": "name",
        "schema": actor_schema,
        "fields": ["name", "gender", "birth_date"]
    },
    "movie": {
        "model": Movie,
        "unique": "title",
        "schema": movie_schema,
        "fields": ["title", "release_date"]
    }
}


def validate_actor_ids(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        json_data = request.get_json(force=True)

        if "actor_ids" not in json_data:
            return func(*args, **kwargs, actor_ids_present=False)

        actor_ids = json_data.get("actor_ids", [])

        try:
            actor_ids = actor_ids_schema.load({"ids": actor_ids})

            # Remove duplicate ids
            actor_ids = list(set(actor_ids.get("ids")))

        except ValidationError:
            return (
                {
                    "success": False,
                    "message": {
                        "actor_ids": "Actor ids must be a list of integers"
                    },
                },
                400,
            )

        invalid_actor_ids = Actor.get_invalid_actor_ids(actor_ids)

        if invalid_actor_ids:
            return (
                {
                    "success": "False",
                    "message": f"Actors with Ids {invalid_actor_ids} do "
                               f"not exist",
                },
                400,
            )

        return func(
            *args, **kwargs, actor_ids=actor_ids, actor_ids_present=True
        )

    return wrapper


def contains_request_data(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            json_data = request.get_json(force=True)
            if not json_data:
                return (
                    {"success": False, "message": "No input data provided"},
                    400,
                )
        except Exception as err:
            return (
                {
                    "success": False,
                    "message": "Please Provide valid json data format",
                },
                400,
            )

        return func(*args, **kwargs, data=json_data)

    return wrapper


'''
id_exists(entity)
    Checks if the id in the query params of the specified entity(model) 
    exists in the db
    If id exists:
      the db_object the specified id is injected into the response
    else:
       a 404 error is returned
    EXAMPLE   
        for @id_exists(entity="actor")
            endpoints
                PATCH /actors/{id}, DELETE /actors/{id}, GET /actors/{id}
            returns f(*args, **kwargs, actor_db_object = Actor_Object(id)
                accessed as kwargs['actor_db_object']
        for @id_exists(entity="movie")
            endpoints
                PATCH /movies/{id}, DELETE /movies/{id}, GET /movies/{id}, 
                GET /movies/{id}/actors 
            returns f(*args, **kwargs, movie_db_object = Movie_Object(id)
                accessed as kwargs['movie_db_object']
'''


def id_exists(entity):
    def id_exists_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            primary_id = kwargs[f"{entity}_id"]
            model = entities[entity]["model"]
            try:
                entity_object = model.query

                # Do not return soft deleted actors
                if entity == 'actor':
                    entity_object = entity_object.filter_by(deleted=False)

                entity_object = entity_object.filter_by(
                    id=primary_id).first_or_404()
                entity_object_dict = {f"{entity}_db_object": entity_object}
            except NotFound:
                return {
                           "success": False,
                           "message": f"{entity.capitalize()} does not exist"
                       }, 404
            return func(*args, **kwargs, **entity_object_dict)

        return wrapper

    return id_exists_decorator


def validate_actor_data(method="post"):
    def validate_actor_data_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            json_data = request.get_json(force=True)
            try:
                actor_data = json_data["actor"]
            except KeyError:
                return (
                    {
                        "success": False,
                        "message": "provide correct data format",
                        "format": "{actor: {name: string, birth_date: YYYY-MM-DD, gender: "
                                  "one of M or F}",
                    },
                    422,
                )
            actor = {
                "name": actor_data.get("name"),
                "birth_date": actor_data.get("birth_date"),
                "gender": actor_data.get("gender"),
            }
            if method == "patch":
                actor_object = kwargs["actor_db_object"]
                actor = {
                    "name": actor_data.get("name", actor_object.name),
                    "birth_date": actor_data.get(
                        "birth_date", actor_object.birth_date
                    ),
                    "gender": actor_data.get("gender", actor_object.gender),
                }

            try:
                actor = actor_schema.load(actor)
            except ValidationError as err:
                # Show Errors if validation fails
                return {"success": False, "message": err.messages}, 400

            return func(*args, **kwargs, actor=actor)

        return wrapper

    return validate_actor_data_decorator


'''
title_or_name_exists(method='post', entity='actor', field='name')
    Checks the provided unique field value does not already exist in the the db
    if method is patch and not post, the record with specified id is 
    excluded from the check
    
    if any record exists:
        a 409 conflict error is returned
    else:
        execution continues in the decorated function/endpoint

    EXAMPLE   
        for (method='post', entity='actor', field='name')
            endpoints
                PATCH /actors/{id}, POST /actors
            check made against name
        for (method='post', entity='movie', field='title')
            endpoints
                PATCH /movies/{id}, POST /movies
            check made against title   
'''


def title_or_name_exists(method='post', entity='actor', field='name'):
    def title_or_name_exists_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            exists_query = None
            if entity == 'actor':
                actor_name_from_req_body = kwargs['actor'].name

                exists_query = Actor.query.filter(
                    Actor.name.ilike(actor_name_from_req_body)
                )

            elif entity == 'Movie':
                movie_title_from_req_body = kwargs['movie'].title

                exists_query = Movie.query.filter(
                    Movie.title.ilike(movie_title_from_req_body)
                )

            # check unique field against other records except the current one
            # Reason: for update the Artist name or Movie title must not be
            # the same as any in the db
            if method == 'patch' and entity == 'actor':

                actor_object_in_db = kwargs['actor_db_object']
                actor_id = actor_object_in_db.id
                exists_query = exists_query.filter(Actor.id != actor_id)

            elif method == 'patch' and entity == 'Movie':

                movie_object_in_db = kwargs['movie_db_object']
                movie_id = movie_object_in_db.id
                exists_query = exists_query.filter(Movie.id != movie_id)

            count = exists_query.count()

            if count:
                return (
                    {
                        "success": False,
                        "message":
                            f"{entity.capitalize()} with specified "
                            f"{field} already exists",
                    },
                    409,
                )
            return func(*args, **kwargs)

        return wrapper

    return title_or_name_exists_decorator


def validate_movie_data(method="post"):
    def validate_movie_data_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            json_data = request.get_json(force=True)

            try:
                movie_data = json_data["movie"]

            except KeyError as err:
                return (
                    {
                        "success": False,
                        "message": f"please provide {err} field",
                    },
                    400,
                )
            title = movie_data.get("title")
            release_date = movie_data.get("release_date")

            if method == "patch":
                movie_object = kwargs["movie_db_object"]
                title = movie_data.get("title", movie_object.title)
                release_date = movie_data.get(
                    "release_date",
                    movie_object.release_date.strftime("%Y-%m-%d"),
                )

            try:
                title = str(title).strip()
                movie = movie_schema.load(
                    {"title": title, "release_date": release_date}
                )
            except ValidationError as err:
                # Show Errors if validation fails
                return {"success": False, "message": err.messages}, 400

            return func(*args, **kwargs, movie=movie)

        return wrapper

    return validate_movie_data_decorator
