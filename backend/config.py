import os


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI")
    FLASK_ENV = "production"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    FLASK_ENV = "development"
    SQLALCHEMY_ECHO = True
    DEVELOPMENT = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI_DEV")


class TestingConfig(Config):
    FLASK_ENV = "testing"
    TESTING = True
    DEBUG = True
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI_TEST")
