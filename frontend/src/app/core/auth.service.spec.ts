import {getTestBed, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {mockedPayload, MockJwtHelperService, routerSpy} from '../shared/__mocks__/index.mock';

import {AuthService} from './auth.service';


describe('AuthService', () => {
    let
        authService: AuthService,
        router: Router,
        jwtHelperService: JwtHelperService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: Router, useValue: routerSpy},
                {provide: JwtHelperService, useValue: MockJwtHelperService},
            ]
        });

        authService = getTestBed().get(AuthService);
        router = getTestBed().get(Router);
        jwtHelperService = getTestBed().get(JwtHelperService);

    });

    afterEach(() => {
        authService.token = null;
        localStorage.clear();
    });

    it('should define #AuthService', () => {
        expect(authService).toBeDefined();
    });

    it('should #buildLoginLink', () => {
        authService.clientId = 'clientId';
        authService.audience = 'audience';
        authService.callbackURL = 'callbackURL';
        authService.url = 'auth0Url';

        const loginLink = authService.buildLoginLink();
        const builtLoginLink = `https://auth0Url.auth0.com/authorize?audience=${authService.audience
        }&response_type=token&client_id=${authService.clientId}&redirect_uri=${authService.callbackURL}`;
        expect(loginLink).toEqual(builtLoginLink);
    });

    it('should #checkTokenFragment', () => {
        window.location.hash = '#access_token=token';

        authService.setJWT = jest.fn();
        authService.checkTokenFragment();
        expect(authService.token).toEqual('token');
        expect(authService.setJWT).toBeCalled();
    });

    it('should #checkTokenFragment no access token', () => {
        window.location.hash = '';
        authService.setJWT = jest.fn();
        authService.checkTokenFragment();
        expect(authService.token).toBeNull();
        expect(authService.setJWT).not.toBeCalled();
    });

    it('should #setJWT and decode token if present', () => {
        authService.token = 'mytoken';
        authService.decodeJWT = jest.fn();

        authService.setJWT();
        const storedToken = localStorage.getItem('JWTS_LOCAL_KEY');
        expect(authService.decodeJWT).toBeCalled();
        expect(storedToken).toBe(authService.token);
    });

    it('should #setJWT and update localStorage if token not', () => {

        localStorage.removeItem('JWTS_LOCAL_KEY');
        authService.decodeJWT = jest.fn();
        authService.token = null;

        authService.setJWT();
        const storedToken = localStorage.getItem('JWTS_LOCAL_KEY');
        expect(authService.decodeJWT).not.toBeCalled();
        expect(storedToken).toBe('null');
    });

    it('should #loadJWT and not decode token if absent', () => {
        authService.decodeJWT = jest.fn();
        authService.loadJWTs();

        expect(authService.decodeJWT).not.toBeCalled();
    });

    it('should #loadJWT and decode token if present', () => {
        localStorage.setItem('JWTS_LOCAL_KEY', 'token');

        authService.decodeJWT = jest.fn();
        authService.loadJWTs();

        expect(authService.decodeJWT).toBeCalled();
        expect(authService.token).toEqual('token');
    });

    it('should get #activejwt', () => {
        const token = authService.activeJWT();
        expect(token).toEqual(authService.token);
    });

    it('should #decodeJWT', () => {
        authService.decodeJWT();
        expect(authService.payload).toEqual(mockedPayload);
    });

    it('should #logout', () => {
        authService.setJWT = jest.fn();
        authService.logout();

        expect(authService.token).toEqual('');
        expect(authService.payload).toBeNull();
        expect(authService.isLoggedIn).toBeFalsy();
        expect(authService.setJWT).toBeCalled();
        expect(router.navigate).toBeCalled();
        expect(router.navigate).toBeCalledWith(['/tabs/user-page']);
    });

    it('should run #can to check permissions', () => {
        const can = authService.can('get:movies');
        const cannot = authService.can('get:movie-details');
        expect(can).toBeTruthy();
        expect(cannot).toBeFalsy();
    });

    it('should run #isTokenExpired', () => {
        let isTokenExpired = authService.isTokenExpired();
        expect(isTokenExpired).toBeTruthy();

        jwtHelperService.isTokenExpired = jest.fn().mockReturnValue(false);

        isTokenExpired = authService.isTokenExpired();
        expect(isTokenExpired).toBeFalsy();
    });

    it('should run #isAuthenticated', () => {
        jwtHelperService.isTokenExpired = jest.fn().mockReturnValue(true);
        let isAuthenticated = authService.isAuthenticated();

        expect(isAuthenticated).toBeFalsy();
        expect(authService.isLoggedIn).toBeFalsy();

        jwtHelperService.isTokenExpired = jest.fn().mockReturnValue(false);
        isAuthenticated = authService.isAuthenticated();

        expect(isAuthenticated).toBeTruthy();
        expect(authService.isLoggedIn).toBeTruthy();
    });

});
