import {HttpRequest} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

import {AuthService} from '../core/auth.service';
import {AuthServiceSpy} from '../shared/__mocks__/index.mock';
import {AuthHeaderInterceptorService} from './auth-header-interceptor.service';

describe('HttpInterceptorService', () => {

    let
        interceptor: AuthHeaderInterceptorService,
        authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthHeaderInterceptorService,
                {provide: AuthService, useValue: AuthServiceSpy},

            ]
        });

        interceptor = TestBed.get(AuthHeaderInterceptorService);
        authService = TestBed.get(AuthService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should run #intercept', () => {
        authService.activeJWT = jest.fn(() => 'Token');
        const url = '/api/v1/movies';
        const reqMock = new HttpRequest('GET', url);

        const next = {
            handle: jest.fn()
        };

        jest.spyOn(reqMock, 'clone');

        interceptor.intercept(reqMock, next);
        expect(next.handle).toHaveBeenCalled();
        expect(reqMock.clone).toHaveBeenCalledWith(
            {setHeaders: {Authorization: 'Bearer Token'}});
    });
});
