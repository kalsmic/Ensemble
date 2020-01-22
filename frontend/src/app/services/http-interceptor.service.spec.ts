import {HttpRequest} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of as ObservableOf} from 'rxjs';
import {AuthService} from '../core/auth.service';
import {ToastService} from '../core/toast.service';
import {AuthServiceSpy, routerSpy} from '../shared/__mocks__/index.mock';

import {HttpInterceptorService} from './http-interceptor.service';

describe('HttpInterceptorService', () => {
    const toastServiceSpy = {
        error: jest.fn().mockReturnValue({
            then() {
            }
        })
    };

    let
        interceptor: HttpInterceptorService,
        authService: AuthService,
        router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: Router, useValue: routerSpy},
                {provide: AuthService, useValue: AuthServiceSpy},
                {provide: ToastService, useValue: AuthServiceSpy},

            ]
        });

        interceptor = TestBed.get(HttpInterceptorService);
        authService = TestBed.get(AuthService);
        router = TestBed.get(Router);
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
            handle: jest.fn(() => ObservableOf({}))
        };

        jest.spyOn(reqMock, 'clone');

        // @ts-ignore
        interceptor.intercept(reqMock, next);
        expect(next.handle).toHaveBeenCalled();
        expect(reqMock.clone).toHaveBeenCalledWith(
            {setHeaders: {Authorization: 'Bearer Token'}});
    });
});
