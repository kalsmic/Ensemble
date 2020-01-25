import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';

const JWTS_LOCAL_KEY = 'JWTS_LOCAL_KEY';


@Injectable({
    providedIn: 'root'
})
export class AuthService {


    url = environment.auth0.url;
    audience = environment.auth0.audience;
    clientId = environment.auth0.clientId;
    callbackURL = environment.auth0.callbackURL;
    token: string = localStorage.getItem(JWTS_LOCAL_KEY) || null;
    payload: any;
    public isLoggedIn: boolean;

    constructor(private router: Router) {}

    buildLoginLink = (callbackPath = '') => {
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
    checkTokenFragment = () => {
        // parse the fragment
        const fragment = window.location.hash.substr(1).split('&')[0].split('=');
        // check if the fragment includes the access token
        if (fragment[0] === 'access_token') {
            // add the access token to the jwt
            this.token = fragment[1];
            // save jwts to localstore
            this.setJWT();
        }
    }

    setJWT = () => {
        localStorage.setItem(JWTS_LOCAL_KEY, this.token);
        if (this.token) {
            this.decodeJWT(this.token);
        }
    }

    loadJWTs = () => {
        this.token = localStorage.getItem(JWTS_LOCAL_KEY) || null;
        if (this.token) {
            this.decodeJWT(this.token);
        }
    }

    activeJWT = () => {
        return this.token;
    }

    decodeJWT = (token: string = this.token) => {
        const jwtservice = new JwtHelperService();
        this.payload = jwtservice.decodeToken(token);
        return this.payload;
    }

    logout = () => {
        this.token = '';
        this.payload = null;
        this.setJWT();
        this.isLoggedIn = false;
        this.router.navigate(['/tabs/user-page']);

    }

    can = (permission: string) => {
        this.payload = this.decodeJWT();
        return this.payload && this.payload.permissions && this.payload.permissions.length &&
            this.payload.permissions.indexOf(permission) >= 0;
    }

    isTokenExpired = () => {
        const jwtHelperService = new JwtHelperService();
        return jwtHelperService.isTokenExpired(this.activeJWT());
    }

    isAuthenticated = () => {
        this.isLoggedIn = !this.isTokenExpired();

        if (!this.isLoggedIn) {
            this.logout();
        }
        return this.isLoggedIn;
    }

}
