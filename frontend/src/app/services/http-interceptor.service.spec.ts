import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {mockRouter} from '../shared/__mocks__/index.spec';

import {HttpInterceptorService} from './http-interceptor.service';

describe('HttpInterceptorService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [{provide: Router, useValue: mockRouter}]
    }));

    it('should be created', () => {
        const service: HttpInterceptorService = TestBed.get(HttpInterceptorService);
        expect(service).toBeTruthy();
    });
});
