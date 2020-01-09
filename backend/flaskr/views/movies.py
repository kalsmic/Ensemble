import sys
import json 

from flask import request, abort
from flask_restful import Resource
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from flaskr.auth import requires_auth
from flaskr.helpers import validate_actor_ids, validate_movie_data, \
    contains_request_data, movie_id_exists
from flaskr.model import db, Movie, MovieCrew, Actor, movies_schema, movie_schema


def paginate(result_query):
    return dict(
        total=result_query.total,
        current_page=result_query.page,
        per_page=result_query.per_page,
        next_num=result_query.next_num,
        prev_num=result_query.prev_num,
        has_prev=result_query.has_prev,
        has_next=result_query.has_next,
        pages=result_query.pages,
        success=True)


class CreateListMovieResource(Resource):

    @requires_auth('get:movies')
    def get(self, *args, **kwargs):

        page = request.args.get("page", 1, type=int)

        movie_query = Movie.query.paginate(page=page, error_out=False,
                                           max_per_page=10)

        movie_items = movie_query.items

        result = paginate(movie_query)
        result['movies'] = movies_schema.dump(movie_items)

        return result, 200

    @requires_auth('post:movies')
    @contains_request_data
    @validate_movie_data
    @validate_actor_ids
    def post(self, *args, **kwargs):
        movie = kwargs['movie']
        actor_ids = kwargs.get('actor_ids')

        try:
            movie.insert()
            
            if actor_ids:
                movie.add_movie_actors(actor_ids)
            
            result = movie_schema.dump(movie)

        except IntegrityError:
            # Show Error if Movie already exists
            return {
                       "success": False,
                       "error": 'Movie already exists'
                   }, 409

        finally:
            db.session.close()

        return {"success": True, 'movie': result,
                'message': 'Movie created Successfully'}, 201


class RetrieveUpdateDestroyMovieResource(Resource):

    @requires_auth('get:movies')
    @movie_id_exists
    def get(self, *args, **kwargs):
        movie = kwargs['movie_object']
        movie = movie_schema.dump(movie)

        return {
                   "success": True,
                   "movie": movie,
               }, 200

    @requires_auth('patch:movies')
    @movie_id_exists
    @contains_request_data
    @validate_movie_data
    @validate_actor_ids
    def patch(self, *args, **kwargs):
        movie = kwargs['movie_object']
        movie_data = kwargs['movie']
        actor_ids = kwargs['actor_ids']

        try:
            movie.title = movie_data['title']
            movie.release_date = movie_data['release_date']
            if actor_ids:
                movie.remove_actors_from_movie(actor_ids)
                movie.update_movie_actors(actor_ids)
                db.session.commit()

            result = movie_schema.dump(movie)
        except IntegrityError:
            print(sys.exc_info())
            db.session.rollback()
            return {"success": False, "message": 'Movie with specified name'
                                                 'already exists'}, 409
        except BaseException:
            print(sys.exc_info())
            abort(400)

        return {"success": True, 'Movie': result,
                "message": "Movie updated successfully"}, 200

    @requires_auth('delete:movies')
    @movie_id_exists
    def delete(self, *args, **kwargs):

        movie = kwargs['movie_object']

        movie.delete()

        return {"success": True,
                "message": "Movie deleted successfully"}, 200

