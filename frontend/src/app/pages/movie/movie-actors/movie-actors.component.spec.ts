import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MovieServiceSpy} from '../../../shared/__mocks__/index.mock';
import {MovieService} from '../movie.service';
import {MovieActorsComponent} from './movie-actors.component';

describe('MovieActorsComponent', () => {
    let component: MovieActorsComponent;
    let fixture: ComponentFixture<MovieActorsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],

            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [MovieActorsComponent],
            providers: [
                {provide: MovieService, useClass: MovieServiceSpy}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(MovieActorsComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    }));
    afterEach(() => {
        fixture.destroy();
        jest.resetAllMocks();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should run #ngOnInit()', () => {
        component.getMovieActors = jest.fn();
        component.ngOnInit();
        expect(component.getMovieActors).toHaveBeenCalled();
    });

    it('should run #getMovieActors()', () => {
        component.getMovieActors();
        expect(component.movieActors).toMatchObject([{actor: {id: 1, name: 'actor Name'}}]);
    });

    it('should run #goToPage()', () => {
        component.getMovieActors = jest.fn();
        component.goToPage(1);
        expect(component.getMovieActors).toHaveBeenCalled();
        expect(component.getMovieActors).toHaveBeenCalledWith(1);
    });

});
