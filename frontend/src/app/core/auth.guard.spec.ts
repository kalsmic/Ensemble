import {getTestBed, inject, TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthServiceSpy, routerSpy} from '../shared/__mocks__/index.mock';

import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';


describe('AuthGuard', () => {
    let
        service: AuthGuard,
        authService: AuthService,
        router: Router,
        state: RouterStateSnapshot,
        route: ActivatedRouteSnapshot;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                {provide: Router, useValue: routerSpy},
                {provide: AuthService, useValue: AuthServiceSpy},
            ]

        });
        service = getTestBed().get(AuthGuard);
        authService = getTestBed().get(AuthService);
        router = getTestBed().get(Router);
        route = new ActivatedRouteSnapshot();
        state = {
            url: 'authenticated/url',
            root: route
        };


    });
    afterEach(() => jest.clearAllMocks());

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));

    it('should run #canActivate() authenticated', async () => {
        authService.isAuthenticated = jest.fn().mockReturnValue(true);
        service.canActivate(route, state);
        expect(authService.isAuthenticated).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should run #canActivate() redirect unauthenticated', async () => {
        authService.isAuthenticated = jest.fn().mockReturnValue(false);
        service.canActivate(route, state);
        expect(authService.isAuthenticated).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['tabs/user-page',]);
    });
});
