from flask import Blueprint
from flask_restful import Api

from flaskr.views.actors import (
    RetrieveUpdateDestroyActorResource,
    CreateListActorResource,
    SearchActorResource,
)
from flaskr.views.errors import errors
from flaskr.views.movies import (
    RetrieveUpdateDestroyMovieResource,
    CreateListMovieResource,
    ListMovieActorsResource,
)

api_bp = Blueprint("api/", __name__)

api = Api(api_bp, errors=errors, catch_all_404s=True)

# Route
api.add_resource(CreateListActorResource, "/v1/actors")
api.add_resource(
    RetrieveUpdateDestroyActorResource, "/v1/actors/<int:actor_id>"
)

api.add_resource(SearchActorResource, "/v1/actors/search")

# Movie Views
api.add_resource(CreateListMovieResource, "/v1/movies")
api.add_resource(
    RetrieveUpdateDestroyMovieResource, "/v1/movies/<int:movie_id>"
)
api.add_resource(ListMovieActorsResource, "/v1/movies/<int:movie_id>/actors")
