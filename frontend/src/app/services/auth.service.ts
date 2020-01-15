import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';

import {fakeTokens} from '../shared/__mocks__/tokens';
import {Router} from '@angular/router';

const JWTS_LOCAL_KEY = 'JWTS_LOCAL_KEY';


@Injectable({
    providedIn: 'root'
})
export class AuthService {


    constructor(private router: Router) {
    }
    url = environment.auth0.url;
    audience = environment.auth0.audience;
    clientId = environment.auth0.clientId;
    callbackURL = environment.auth0.callbackURL;
    token: string;
    payload: any;
    public isLoggedIn: boolean;

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
        const jwtservice = new JwtHelperService();
        this.payload = jwtservice.decodeToken(token);
    }

    logout() {
        this.token = '';
        this.payload = null;
        this.set_jwt();
        this.isLoggedIn = false;
    }

    can(permission: string) {
        return this.payload && this.payload.permissions && this.payload.permissions.length &&
            this.payload.permissions.indexOf(permission) >= 0;
    }

    isTokenExpired() {
        const jwtHelperService = new JwtHelperService();
        return jwtHelperService.isTokenExpired(this.activeJWT());
    }

    isAuthenticated() {
        this.isLoggedIn = !this.isTokenExpired();
        if (!this.isLoggedIn) {
            this.logout();
        }
        return this.isLoggedIn;
    }

    getFakeAuthToken($event) {
        const role = $event.target.value;
        this.token = fakeTokens[role];
        this.set_jwt();
        this.router.navigate(['/tabs/actors']);
    }

}
