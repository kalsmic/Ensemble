import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';

import {AuthService} from '../core/auth.service';
import {ToastService} from '../core/toast.service';
import {AuthServiceSpy, MockRouter, MockToastService} from '../shared/__mocks__/index.mock';
import {HttpErrorInterceptorService} from './http-error-interceptor.service';


describe('HttpErrorInterceptorService', () => {

    const mockUrl = '/url';
    let mockRequest;
    let
        interceptor: HttpErrorInterceptorService,
        authService: AuthService,
        router: Router,
        httpClient: HttpClient,
        toast: ToastService,
        httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HttpErrorInterceptorService,
                {provide: Router, useClass: MockRouter},
                {provide: AuthService, useClass: AuthServiceSpy},
                {provide: ToastService, useClass: MockToastService},
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptorService,
                    multi: true,
                },
            ]
        });

        httpClient = TestBed.get(HttpClient);

        router = TestBed.get(Router);
        // spyOn(router, 'navigate');
        spyOn(router, 'navigateByUrl');
        router.navigateByUrl = jest.fn().mockResolvedValueOnce(() => jest.fn());

        httpMock = TestBed.get(HttpTestingController);

        authService = TestBed.get(AuthService);
        router = TestBed.get(Router);
        toast = TestBed.get(ToastService);
        spyOn(toast, 'error');
        toast.error = jest.fn().mockResolvedValueOnce(() => jest.fn());

        interceptor = TestBed.get(HttpErrorInterceptorService);
        jest.spyOn(console, 'log');

        mockRequest = (status, errorMessage) => httpClient.get<any>(mockUrl).subscribe(
            res => fail(`should have failed with the ${status} error`),
            (error: HttpErrorResponse) => {
                expect(error).toEqual(errorMessage);
            }
        );

    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('should be created', () => {
        const service: HttpErrorInterceptorService = TestBed.get(HttpErrorInterceptorService);
        expect(service).toBeTruthy();
    });


    it('should #intercept 401 Error', () => {
        const errorMessage = {message: 'Not Authenticated'};
        // Make an HTTP GET request
        mockRequest(401, errorMessage);


        const req = httpMock.expectOne(mockUrl);

        // Respond with mock error
        req.flush(errorMessage, {status: 401, statusText: 'Unauthorized'});
        expect(toast.error).toBeCalled();
        expect(toast.error).toBeCalledWith(errorMessage.message);
        expect(router.navigateByUrl).toBeCalled();
        expect(router.navigateByUrl).toBeCalledWith('/tabs/user-page');
        expect(console.log).toBeCalledWith('error status : 401 Unauthorized');

    });

    it('should #intercept 403 Error', () => {
        const errorMessage = {message: 'Method Not Allowed'};
        // Make an HTTP GET request
        mockRequest(403, errorMessage);


        const req = httpMock.expectOne(mockUrl);

        // Respond with mock error
        req.flush(errorMessage, {status: 403, statusText: 'Method Not Allowed'});
        expect(toast.error).toBeCalled();
        expect(toast.error).toBeCalledWith(errorMessage.message);
        expect(console.log).toBeCalledWith('error status : 403 Method Not Allowed');

    });

    it('should #intercept 500 Error', () => {
        const errorMessage = {message: 'Not enough rights to perform this action'};
        // Make an HTTP GET request
        mockRequest(500, errorMessage);


        const req = httpMock.expectOne(mockUrl);

        // Respond with mock error
        req.flush(errorMessage, {status: 500, statusText: 'Internal Server Error'});
        expect(toast.error).toBeCalled();
        expect(toast.error).toBeCalledWith('Something went wrong, make sure you are connected');
        expect(console.log).toBeCalledWith('error status : 500 Internal Server Error');

    });

    it('should #intercept 500 Error', () => {
        const errorMessage = {message: 'Not modified'};
        // Make an HTTP GET request
        mockRequest(304, errorMessage);


        const req = httpMock.expectOne(mockUrl);

        // Respond with mock error
        req.flush(errorMessage, {status: 304, statusText: 'Not Modified'});
        expect(toast.error).toBeCalled();
        expect(toast.error).toBeCalledWith('Oops! ,Something went wrong!');
        expect(console.log).toBeCalledWith('error status : 304 Not Modified');
    });

    it('should #intercept Error Event', () => {
        const errorMessage = {message: 'Not modified'};
        // Make an HTTP GET request
        mockRequest(304, errorMessage);


        const req = httpMock.expectOne(mockUrl);

        // Respond with mock error
        req.error(new ErrorEvent('network error'));

        expect(toast.error).toBeCalled();
        expect(toast.error).toBeCalledWith('Something unexpected happened, Please check your network connection');
        expect(console.log).toBeCalledWith('error status : 0 Unknown Error');
    });
});
