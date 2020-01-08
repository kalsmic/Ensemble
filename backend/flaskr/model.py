import datetime
import json
from os import environ

from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from marshmallow import fields, validate

db = SQLAlchemy()
ma = Marshmallow()

database_path = environ.get('DATABASE_URI')


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()


class BaseModel(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Actor(BaseModel):
    __tablename__ = 'actors'
    name = db.Column(db.String(250), nullable=False, unique=True)
    gender = db.Column(db.String(250), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)

    movie_ids = db.relationship('Movie', secondary='movie_crew')

    def __init__(self, name, gender, birth_date):
        self.name = name
        self.gender = gender
        self.birth_date = birth_date

    '''
    short()
        short form representation of the Actor model
    '''

    def short(self):
        return {
            'id': self.id,
            'name': self.name
        }

    '''
    long()
        long form representation of the Actor model
    '''

    def long(self):
        current_year = datetime.datetime.today().strftime("%Y")
        birth_year = self.birth_date.year
        age = current_year - birth_year
        return {
            'id': self.id,
            'name': self.name,
            'gender': self.gender,
            'birth_date': self.birth_date.strftime('%Y-%m-%d'),
            "age": age

        }

    @classmethod
    def get_invalid_actor_ids(cls, actor_ids):
        valid_ids = [actor.id for actor in db.session.query(cls).filter(
            cls.id.in_(actor_ids)).all()
                     ]

        #     Compute difference to get invalid ids
        invalid_ids = list(set(actor_ids) - set(valid_ids))

        return invalid_ids

    @classmethod
    def search_actors(cls, search_term, actor_ids=[]):
        actors_query = cls.query.filter(
            cls.name.ilike(f"%{search_term}%")
        ).filter(cls.id.notin_(actor_ids)).all()

        return actors_query

    def __repr__(self):
        return json.dumps(self.short())


class Movie(BaseModel):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), unique=True, nullable=False)
    release_date = db.Column(db.Date, nullable=False)

    actor_ids = db.relationship('Actor', secondary='movie_crew')

    def __init__(self, title, release_date):
        self.title = title
        self.release_date = release_date

    def add_movie_actors(self, actor_ids):
        movie_actors_objs = [
            MovieCrew(movie_id=self.id,
                      actor_id=actor_id)
            for actor_id in actor_ids
        ]

        db.session.add_all(movie_actors_objs)
        db.session.commit()

    def get_movie_actors(self):
        movie_crew = MovieCrew.query.filter_by(movie_id=self.id).join(
            Actor).all()

        return movie_crew

    def update_movie_actors(self, actor_ids):
        movie_actors_in_db = MovieCrew.get_actor_ids(movie_id=self.id)

        # generate a list of new actors not in db
        actors_to_insert = list(set(actor_ids) - set(movie_actors_in_db))
        if actors_to_insert:
            self.add_movie_actors(actors_to_insert)

    def remove_actors_from_movie(self, actor_ids):
        actors_to_delete = db.session.query(MovieCrew).filter_by(
            movie_id=self.id).filter(MovieCrew.actor_id.notin_(actor_ids))
        actors_to_delete.delete(synchronize_session=False)

    '''
    short()
        long form representation of the Movie model
    '''

    def short(self):
        return {
            'id': self.id,
            'title': self.title
        }

    def __repr__(self):
        return json.dumps(self.short())


class MovieCrew(db.Model):
    __tablename__ = 'movie_crew'

    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'),
                         primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey('actors.id'),
                         primary_key=True)

    movie = db.relationship('Movie', backref=db.backref('movie_crew',
                                                        cascade='all, delete-orphan'))
    actor = db.relationship('Actor', backref=db.backref('movie_crew',
                                                        cascade='all, delete-orphan'))

    def __init__(self, movie_id, actor_id):
        self.movie_id = movie_id
        self.actor_id = actor_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def get_actor_ids(cls, movie_id):
        results = cls.query.filter_by(movie_id=movie_id).all()
        return [result.actor_id for result in results]

    '''
    short()
        short form representation of the Movie model
    '''

    def short(self):
        return {
            'movie': self.movie.title,
            'actor': self.actor.name
        }

    def __repr__(self):
        return json.dumps(self.short())


class ActorSchema(ma.ModelSchema):
    gender = fields.String(validate=validate.OneOf(["M", "F"]))
    name = fields.String(required=True)
    birth_date = fields.Date(required=True)
    age = fields.Function(
        lambda obj: datetime.datetime.today().year - obj.birth_date.year)

    movie_crew = fields.List(fields.Nested(lambda: MovieCrewSchema(only=(
        "movie",))))

    class Meta:
        model = Actor
        fields = ("id", "name", "gender", "age", "birth_date",
                  'movie_ids', 'movie_crew')
        ordered = True


class MovieSchema(ma.ModelSchema):
    movie_crew = fields.List(fields.Nested(lambda: MovieCrewSchema(only=(
        "actor",))))

    class Meta:
        model = Movie
        fields = ("id", "title", "release_date", "actor_ids",
                  "movie_crew")
        ordered = True


class MovieCrewSchema(ma.ModelSchema):
    actor = fields.Nested(lambda: ActorSchema(only=("id", "name")),
                          dump_only=True)
    movie = fields.Nested(lambda: MovieSchema(only=("id", "title")),
                          dump_only=True)

    class Meta:
        model = MovieCrew


movies_schema = MovieSchema(many=True, exclude=['actor_ids', 'movie_crew'])
movie_schema = MovieSchema()
movie_crew_schema = MovieCrewSchema(many=True, exclude=['movie'])

actors_schema = ActorSchema(many=True, exclude=['movie_ids', 'movie_crew'])
actor_schema = ActorSchema()
