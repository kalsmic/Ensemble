import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
// import { JwtHelperService } from '@auth0/angular-jwt';

const JWTS_LOCAL_KEY = 'JWTS_LOCAL_KEY';

// const JWTS_ACTIVE_INDEX_KEY = 'JWTS_ACTIVE_INDEX_KEY';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    url = environment.auth0.url;
    audience = environment.auth0.audience;
    clientId = environment.auth0.clientId;
    callbackURL = environment.auth0.callbackURL;
    // token: string;
    // payload: any;
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9UUkVSalZCTnpZeFFrUTROemt6UmpaRE16azVORGt5TkRWQ056STVOMFl6TTBSRE9EQTJOdyJ9.eyJpc3MiOiJodHRwczovL2Rldi03ZDU0LTgyOC5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTQ1Nzk3MTc3ODc5MzE4Mzg3NzAiLCJhdWQiOlsiZW5zZW1ibGUiLCJodHRwczovL2Rldi03ZDU0LTgyOC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTc3OTU4ODcwLCJleHAiOjE1Nzc5NjYwNzAsImF6cCI6IjNNNjBleDcwSFlVamFIQklEQzlsMXYwWE9mVDExaGVwIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInBlcm1pc3Npb25zIjpbImRlbGV0ZTphY3RvcnMiLCJkZWxldGU6bW92aWVzIiwiZ2V0OmFjdG9ycyIsImdldDptb3ZpZXMiLCJwYXRjaDphY3RvcnMiLCJwYXRjaDptb3ZpZXMiLCJwb3N0OmFjdG9ycyIsInBvc3Q6bW92aWVzIl19.mL0HPWWJWmj0B9nZFxEEBH1K5LZDAyDmC6UIKj0D2lprmewsVemJRD21Y2F6_21Bw92HMiT_PmH9hu_L8mJvyIOpXxhu9kP2IPijCj-VEOQ22PbsOQmgMO-6Bar_hM5ksRa2_PU3Z0wIKhJYycF2ccaCMbRnmC2bCnl7LMNe4TurUBGCbC10O0gnwcC7Rw1GksCF04rlXMMHq3F5mIVYyKeqAOUqpox3IErDCOfpoXRMMlepwxNzUGV6ul3vB-Qg1aUR_cVnbtC5ksDzxfJEEZKNDYZuCP-pzE-L9QYH7dAOpd5j-heKmLmzwpcVWr5LyHYGgh5_ioV66fIdfVn0Ig';
    payload: any = {
        'iss': 'https://dev-7d54-828.auth0.com/',
        'sub': 'google-oauth2|114579717787931838770',
        'aud': [
            'ensemble',
            'https://dev-7d54-828.auth0.com/userinfo'
        ],
        'iat': 1577958870,
        'exp': 1580643025,
        'azp': '3M60ex70HYUjaHBIDC9l1v0XOfT11hep',
        'scope': 'openid profile email',
        'permissions': [
            'delete:actors',
            'delete:movies',
            'get:actors',
            'get:movies',
            'patch:actors',
            'patch:movies',
            'post:actors',
            'post:movies'
        ]
    };


    constructor() {
    }

    build_login_link(callbackPath = '') {
        let link = 'https://';
        link += this.url + '.auth0.com';
        link += '/authorize?';
        link += 'audience=' + this.audience + '&';
        link += 'response_type=token&';
        link += 'client_id=' + this.clientId + '&';
        link += 'redirect_uri=' + this.callbackURL + callbackPath;
        return link;
    }

    // invoked in app.component on load
    check_token_fragment() {
        // parse the fragment
        const fragment = window.location.hash.substr(1).split('&')[0].split('=');
        // check if the fragment includes the access token
        if (fragment[0] === 'access_token') {
            // add the access token to the jwt
            this.token = fragment[1];
            // save jwts to localstore
            this.set_jwt();
        }
    }

    set_jwt() {
        localStorage.setItem(JWTS_LOCAL_KEY, this.token);
        if (this.token) {
            this.decodeJWT(this.token);
        }
    }

    load_jwts() {
        this.token = localStorage.getItem(JWTS_LOCAL_KEY) || null;
        if (this.token) {
            this.decodeJWT(this.token);
        }
    }

    activeJWT() {
        return this.token;
    }

    decodeJWT(token: string) {
        // const jwtservice = new JwtHelperService();
        // this.payload = jwtservice.decodeToken(token);
        return this.payload;
    }

    logout() {
        this.token = '';
        this.payload = null;
        this.set_jwt();
    }

    can(permission: string) {
        // return this.payload && this.payload.permissions && this.payload.permissions.length && this.payload.permissions.indexOf(permission) >= 0;
        return true;
    }
}
