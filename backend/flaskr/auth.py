import json
import sys
from functools import wraps
from os import environ
from urllib.error import URLError
from urllib.request import urlopen

from flask import request, abort
from jose import jwt

AUTH0_DOMAIN = environ.get("AUTH0_DOMAIN")
ALGORITHMS = ["RS256"]
API_AUDIENCE = environ.get("API_AUDIENCE")


# Auth Header

# '''
# it should attempt to get the header from the request
#     it should raise an AuthError if no header is present
# it should attempt to split bearer and the token
#     it should raise an AuthError if the header is malformed
# return the token part of the header
# '''


def get_token_auth_header():
    auth_header = request.headers.get("Authorization", "None")

    if auth_header == "null" or auth_header == "" or auth_header == "None":
        abort(status=401, description="Authorization header is expected")

    header_parts = auth_header.split(" ")

    if len(header_parts) != 2 or not header_parts:
        abort(
            status=401,
            description="Authorization header must be in the format Bearer token",
        )

    elif header_parts[0].lower() != "bearer":
        abort(
            status=401,
            description="Authorization header must start with Bearer",
        )

    return header_parts[1]


"""
@INPUTS
    permission: string permission (i.e. 'post:actor')
    payload: decoded jwt payload

    it should raise an AuthError if permissions are not included in the
    payload
    it should raise an AuthError if the requested permission
    string is not in the payload permissions array
    return true otherwise
"""


def check_permissions(permission, payload):
    if "permissions" not in payload:
        abort(403)

    if permission not in payload["permissions"]:
        abort(status=403, description="Permission Not found")
    return True


"""
 @INPUTS
    token: a json web token (string)

    it should be an Auth0 token with key id (kid)
    it should verify the token using Auth0 /.well-known/jwks.json
    it should decode the payload from the token
    it should validate the claims
    return the decoded payload
"""


def verify_decode_jwt(token):
    # Get public key from Auth0
    try:
        jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())

    except URLError:
        print(sys.exc_info())
        abort(500)

    # Get the data in the header
    unverified_header = jwt.get_unverified_header(token)

    # Auth0 token should have a key id
    if "kid" not in unverified_header:
        abort(status=401, description="Authorization malformed")

    rsa_key = {}

    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
            break

    # verify the token
    if rsa_key:
        try:
            # Validate the token using the rsa_key
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/",
            )
            return payload

        except jwt.ExpiredSignatureError:
            abort(status=401, description="Token expired.")

        except jwt.JWTClaimsError:

            abort(
                status=401,
                description="Incorrect claims. Please, "
                            "check the audience and issuer.",
            )
        except Exception:
            abort(
                status=401, description="Unable to parse authentication token."
            )
    abort(status=401, description="Unable to find the appropriate key.")


"""
@INPUTS
    permission: string permission (i.e. 'post:actor')

it should use the get_token_auth_header method to get the token
it should use the verify_decode_jwt method to decode the jwt
it should use the check_permissions method validate claims
and check the requested permission
return the decorator which passes the decoded payload to the
decorated method
"""


def requires_auth(permission=""):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = get_token_auth_header()
            payload = verify_decode_jwt(token)
            check_permissions(permission, payload)
            return f(payload, *args, **kwargs)

        return wrapper

    return requires_auth_decorator
