import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {routerSpy} from '../shared/__mocks__';

import {HttpInterceptorService} from './http-interceptor.service';

describe('HttpInterceptorService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [{provide: Router, useValue: routerSpy}]
    }));

    it('should be created', () => {
        const service: HttpInterceptorService = TestBed.get(HttpInterceptorService);
        expect(service).toBeTruthy();
    });
});
