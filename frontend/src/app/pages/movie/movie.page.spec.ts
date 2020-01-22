import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';

import {AngularDelegate, ModalController, PopoverController} from '@ionic/angular';

import {AuthService} from '../../core/auth.service';
import {AuthServiceSpy, MovieServiceSpy} from '../../shared/__mocks__/index.mock';
import {MoviePage} from './movie.page';
import {MovieService} from './movie.service';

describe('MoviePage', () => {
    let component: MoviePage;
    let fixture: ComponentFixture<MoviePage>;

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
        expect(component.movieService.getMovies).toHaveBeenCalled();
    });

    it('should run #navigateToPage()', async () => {
        component.navigateToPage(1);
        expect(component.movieService.getMovies).toHaveBeenCalled();
        expect(component.movieService.getMovies).toHaveBeenCalledWith(1);
    });

});
