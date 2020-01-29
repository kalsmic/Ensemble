import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';

import {AngularDelegate, ModalController, PopoverController} from '@ionic/angular';

import {AuthService} from '../../core/auth.service';
import {AuthServiceSpy, MovieServiceSpy} from '../../shared/__mocks__/index.mock';
import {MovieActorsComponent} from './movie-actors/movie-actors.component';
import {MoviePage} from './movie.page';
import {MovieService} from './movie.service';

describe('MoviePage', () => {
    let component: MoviePage;
    let fixture: ComponentFixture<MoviePage>;
    let authService: AuthService;
    let movieService: MovieService;
    let modalController: ModalController;
    let popoverController: PopoverController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatTooltipModule],
            declarations: [MoviePage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AngularDelegate,
                {provide: AuthService, useClass: AuthServiceSpy},
                ModalController, PopoverController,
                {provide: MovieService, useClass: MovieServiceSpy}
            ]
        }).overrideComponent(MoviePage, {}).compileComponents();

        fixture = TestBed.createComponent(MoviePage);
        component = fixture.debugElement.componentInstance;
        authService = getTestBed().get(AuthService);
        modalController = getTestBed().get(ModalController);
        popoverController = getTestBed().get(PopoverController);
        movieService = getTestBed().get(MovieService);
    }));

    afterEach(() => {
        fixture.destroy();
        jest.resetAllMocks();

    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should run #ngOnInit()', async () => {
        component.ngOnInit();
        expect(movieService.getMovies).toHaveBeenCalled();
    });

    it('should run #navigateToPage()', async () => {
        component.navigateToPage(1);
        expect(movieService.getMovies).toHaveBeenCalled();
        expect(movieService.getMovies).toHaveBeenCalledWith(1);
    });

    it('should not run #openMovieForm in not permitted', async () => {
        authService.can = jest.fn().mockReturnValue(false);
        modalController.create = jest.fn();
        await component.openMovieForm();
        expect(modalController.create).not.toBeCalled();
    });

    it('should run #openMovieForm if permitted', async () => {
        authService.can = jest.fn().mockReturnValue(true);
        modalController.create = jest.fn(() => ({present: jest.fn()})) as any;

        await component.openMovieForm();
        expect(modalController.create).toBeCalled();
    });

    it('should run #presentActorsPopover', async () => {
        popoverController.create = jest.fn(() => ({present: jest.fn()})) as any;

        await component.presentActorsPopover(1);
        expect(popoverController.create).toBeCalled();
        expect(popoverController.create).toBeCalledWith({
            component: MovieActorsComponent,
            componentProps: {
                movieId: 1,
                showActors: true
            }
        });
    });

    it('should run #navigateToPage', () => {
        component.getMovies = jest.fn();
        component.navigateToPage(1);
        expect(component.getMovies).toBeCalled();
        expect(component.getMovies).toBeCalledWith(1);
    });

    it('should format date', () => {
        const formattedDate = component.displayDate('2019-01-01');
        expect(formattedDate).toBe('01-January-2019');
    });

});
