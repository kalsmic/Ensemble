import {inject, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {mockRouter} from '../shared/__mocks__/index.spec';

import {AuthGuard} from './auth.guard';

describe('AuthGuard', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthGuard, {provide: Router, useValue: mockRouter}]
        });
    });

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});
