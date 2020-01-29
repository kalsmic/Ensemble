# Ensemble Backend

[![Build Status](https://travis-ci.org/kalsmic/Ensemble.svg?branch=master)](https://travis-ci.org/kalsmic/Ensemble) [![Coverage Status](https://coveralls.io/repos/github/kalsmic/Ensemble/badge.svg?branch=master)](https://coveralls.io/github/kalsmic/Ensemble?branch=master)

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

Create a virtual environment to isolate your project dependencies. Instructions for setting up a virtual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once your have set and run up your virtual environment, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) and [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) are libraries to handle the lightweight sqlite database. Since we want you to focus on auth, we handle the heavy lift for you in `./src/database/models.py`. We recommend skimming this code first so you know how to interface with the Drink model.

- [jose](https://python-jose.readthedocs.io/en/latest/) JavaScript Object Signing and Encryption for JWTs. Useful for encoding, decoding, and verifying JWTS.

## Running the server

From within the `backend` directory first ensure you are working using your
 created virtual environment.

Each time you open a new terminal session, run:

```bash
export FLASK_APP="flaskr:create_app('config.DevelopmentConfig')"
```

Also set the following environmental variable for Auth0

```bash
export AUTH0_DOMAIN='your_auth0_domain'
export API_AUDIENCE='auth0_audience'
export DATABASE_URI_DEV='developmenent_db_uri'
export DATABASE_URI='your_production_db'
export DATABASE_URI_TEST='your_test_db'
```

To run the server, execute:

```bash
flask run --reload
```

The `--reload` flag will detect file changes and restart the server automatically.

## Tasks

### Setup Auth0

1. Create a new Auth0 Account
2. Select a unique tenant domain
3. Create a new, single page web application
4. Create a new API
    - in API Settings:
        - Enable RBAC
        - Enable Add Permissions in the Access Token
5. Create new API permissions:
    - `post:actors`
    - `get:actors`
    - `delete:actors`
    - `patch:actors`
    - `post:movies`
    - `get:movies`
    - `delete:movies`
    - `patch:movies`

6. Create new roles for:
    - Casting Assistant
      - Can view actors and movies

    - Casting Director
        - All permissions a Casting Assistant has and…
        - Add or delete an actor from the database
        - Modify actors or movies

    - Executive Producer
        - All permissions a Casting Director has and…
        - Add or delete a movie from the database

7. Endpoints

    | Functionality            | Endpoint                      | Casting assistant  |  Casting Director  | Executive Producer |
    | ------------------------ | ----------------------------- | :----------------: | :----------------: | :----------------: |
    | Fetches a list of actors | GET /actors                   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Fetches a list of movies | GET /movies                   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Fetches a specific actor | GET /actors/&lt;id&gt;        | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Fetches a specific movie | GET /movies/&lt;id&gt;        | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Search an Actor          | POST /actors                  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Creates an actor         | POST /actor                   |        :x:         | :heavy_check_mark: | :heavy_check_mark: |
    | Fetches Movie actors     | GET /movies/&lt;id&gt;/actors |        :x:         | :heavy_check_mark: | :heavy_check_mark: |
    | Patches an actor         | PATCH /actors/&lt;id&gt;      |        :x:         | :heavy_check_mark: | :heavy_check_mark: |
    | Delete an Actor          | DELETE /actors/&lt;id&gt;     |        :x:         | :heavy_check_mark: | :heavy_check_mark: |
    | Creates a movie          | POST /movies                  |        :x:         |        :x:         | :heavy_check_mark: |
    | Deletes a movie          | DELETE /movies/&lt;id&gt;     |        :x:         |        :x:         | :heavy_check_mark: |

    >_tip_: The endpoints are prefixed with  **api/v1** i.e GET actors **/api/v1/actors**

8. Test your endpoints with [Postman](https://getpostman.com).

   - Register 3 users - assign the Casting Assistant role to the first,Casting Director to the second and Executive Producer to the third
   - Sign into each account and make note of the JWT.
   - Import the postman collection `./backend/Ensemble.postman_collection.json`
   - Right-clicking the collection folder ,select edit and navigate to the variables tab, update the JWT token for the three different roles i.e Casting Assistant, Casting Director and Executive Producer.
   - Run the collection to test the endpoints
   >_tip_: To ensure that the tests run correctly please update the ids for
    resources that require accessing a specific record by id

9. Testing with pytest

   - You can also run unit tests by opening your terminal
   - To run tests with pytest, simply run `pytest` in the terminal
   - If your prefer running with unittest, run `python -m unittest`
   - to run tests with coverage, run `pytest --cov flaskr`
