import sys

from flask import request
from flask_restful import Resource
from psycopg2._psycopg import DatabaseError

from flaskr.auth import requires_auth
from flaskr.helpers import (
    validate_actor_ids,
    validate_movie_data,
    contains_request_data,
    title_or_name_exists, id_exists)
from flaskr.models import (
    db,
    Movie,
    movies_schema,
    movie_schema,
    MovieCrew,
    Actor,
    movie_crew_schema,
)


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
        success=True,
    )


class CreateListMovieResource(Resource):

    @requires_auth("get:movies")
    def get(self, *args, **kwargs):
        """
            GET /movies
                - requires get:movies permission
            :returns status code 200 and json
                {"success": True, "movies":movies, ...pagination}
        """
        page = request.args.get("page", 1, type=int)

        movie_query = Movie.query.paginate(
            page=page, error_out=False, max_per_page=10
        )

        movie_items = movie_query.items

        result = paginate(movie_query)
        result["movies"] = movies_schema.dump(movie_items)

        return result, 200

    @requires_auth("post:movies")
    @contains_request_data
    @validate_movie_data("post")
    @title_or_name_exists(method='post', entity='Movie', field='title')
    @validate_actor_ids
    def post(self, *args, **kwargs):
        """
            POST /movies
                creates a new movie
                requires post:movies permission

            :returns status_code 201 on success and json
                {"success": True , "movie": movie, "message": success_message }
            :returns status_code 409 if movie already exists and json
            :returns status_code 400 if any other database error occurs and json
                {"success": False, "message": error_message}
        """
        movie = kwargs["movie"]
        actor_ids = kwargs.get("actor_ids")
        actor_ids_present = kwargs["actor_ids_present"]

        try:
            movie.insert()

            if actor_ids_present:
                movie.add_movie_actors(actor_ids)

            result = movie_schema.dump(movie)

        except DatabaseError:
            db.session.rollback()
            return (
                {
                    "success": False,
                    "message": "Error while adding movie",
                },
                400,
            )

        finally:
            db.session.close()

        return (
            {
                "success": True,
                "movie": result,
                "message": "Movie created Successfully",
            },
            201,
        )


class RetrieveUpdateDestroyMovieResource(Resource):
    @requires_auth("get:movies")
    @id_exists(entity='movie', )
    def get(self, *args, **kwargs):
        """
            GET /movies/<id>
                where <id> is the existing Movie model id
                requires get:movies permission
            :returns status_code 200 on success and json
                {"success":True, 'message":success_message, "movie": movie}
            :returns status_code 400 on failure and json
                {"success": False, "message": error_message}
        """
        movie = kwargs["movie_db_object"]
        movie = movie_schema.dump(movie)

        return {"success": True, "movie": movie, }, 200

    @requires_auth("patch:movies")
    @id_exists(entity='movie')
    @contains_request_data
    @validate_movie_data("patch")
    @title_or_name_exists(method='patch', entity='Movie', field='title')
    @validate_actor_ids
    def patch(self, *args, **kwargs):
        """
            PATCH /movies/<id>
                where <id> is the existing Movie model id
                requires permission patch:movies
                updates the corresponding Movie row for <id>
            :returns status_code 200 on success and json
                {"success": True, "message": success_message, "movie": movie }
            :returns status_code 404 if <id> is not found and json
            :return status_code 409 if movie title already exists on another
            movie
                {"success": False, "message": error_message}
        """
        movie = kwargs["movie_db_object"]
        movie_data = kwargs["movie"]
        actor_ids = kwargs.get("actor_ids")
        actor_ids_present = kwargs["actor_ids_present"]

        title = movie_data.title

        movie.title = title
        movie.release_date = movie_data.release_date

        try:
            movie.update()

            if actor_ids_present:
                movie.remove_actors_from_movie(actor_ids)
                movie.update_movie_actors(actor_ids)
            db.session.commit()

            result = movie_schema.dump(movie)
        except DatabaseError:
            db.session.rollback()
            print(sys.exc_info())

            return (
                {
                    "success": False,
                    "message": "Error while adding movie",
                },
                400,
            )
        finally:
            db.session.close()

        return (
            {
                "success": True,
                "movie": result,
                "message": "Movie updated successfully",
            },
            200,
        )

    @requires_auth("delete:movies")
    @id_exists(entity='movie')
    def delete(self, *args, **kwargs):
        """
         DELETE /movies/<id>
             where <id> is the existing Movie model id
             requires delete:actors permission
         :returns status_code 200 on success after deleting the corresponding
             row for <id> and json
            {"success": True, "message": success_message}
         :returns status_code 404 error if <id> is not found
             {"success": False, "message": error_message}
         """

        movie = kwargs["movie_db_object"]

        movie.delete()

        return {"success": True, "message": "Movie deleted successfully"}, 200


class ListMovieActorsResource(Resource):
    """
        GET /movie/<id>/actors
            where <id> is the existing Movie model id
            requires get:movies permission
            gets a list actors attached to a movie
        :returns status_code 200 on success and json
            {"success":True, 'message":success_message, "actors": [{actor}],
            pagination}
        :returns status_code 400 on failure and json
            {"success": False, "message": error_message}
    """
    @requires_auth("get:movies")
    @id_exists(entity='movie')
    def get(self, *args, **kwargs):
        movie_id = kwargs["movie_id"]

        page = request.args.get("page", 1, type=int)

        movie_actors_query = (
            MovieCrew.query.filter_by(movie_id=movie_id)
                .join(Actor)
                .paginate(page=page, error_out=False, max_per_page=5)
        )

        result = paginate(movie_actors_query)

        result["actors"] = movie_crew_schema.dump(movie_actors_query.items)

        return result, 200
