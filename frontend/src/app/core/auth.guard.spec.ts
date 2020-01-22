import {inject, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {routerSpy} from '../shared/__mocks__';

import {AuthGuard} from './auth.guard';

describe('AuthGuard', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthGuard, {provide: Router, useValue: routerSpy}]
        });
    });

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});
