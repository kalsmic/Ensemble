from flask import Blueprint
from flask_restful import Api

from flaskr.views.actors import RetrieveUpdateDestroyActorResource, \
    CreateListActorResource, SearchActorResource
from flaskr.views.errors import errors
from flaskr.views.movies import RetrieveUpdateDestroyMovieResource, \
    CreateListMovieResource, ListMovieActorsResource

api_bp = Blueprint('api/', __name__)

api = Api(api_bp, errors=errors)
api = Api(api_bp)

# Route
api.add_resource(CreateListActorResource, '/v1/actors')
api.add_resource(RetrieveUpdateDestroyActorResource,
                 '/v1/actors/<int:actor_id>')

api.add_resource(SearchActorResource, '/v1/actors/search')
