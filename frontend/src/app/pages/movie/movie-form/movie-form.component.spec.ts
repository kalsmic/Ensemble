import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularDelegate, ModalController} from '@ionic/angular';
import {throwError} from 'rxjs';

import {AuthService} from '../../../core/auth.service';
import {ArtistServiceSpy, AuthServiceSpy, MovieServiceSpy} from '../../../shared/__mocks__/index.mock';
import {ArtistService} from '../../artist/artist.service';
import {MovieService} from '../movie.service';
import {MovieFormComponent} from './movie-form.component';


describe('MovieFormComponent', () => {
  let fixture;
  let component;
  let artistService;
  let movieService;
  const mockedMovie = {id: 1, title: 'title', release_date: '2019-01-01', actors: [], actor_ids: []};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MovieFormComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {provide: AuthService, useClass: AuthServiceSpy},
        {provide: MovieService, useClass: MovieServiceSpy},
        {provide: ArtistService, useClass: ArtistServiceSpy},
        FormBuilder,
        ModalController,
        AngularDelegate
      ]
    }).overrideComponent(MovieFormComponent, {}).compileComponents();
    fixture = TestBed.createComponent(MovieFormComponent);
    component = fixture.debugElement.componentInstance;
    artistService = TestBed.get(ArtistService);
    movieService = TestBed.get(MovieService);
    component.movie = mockedMovie;
  });

  afterEach(() => {
    fixture.destroy();
    jest.clearAllMocks();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #actorFilter', async () => {
    component.actorFilter = 'My actor';
    component.searchActor = jest.fn();
    expect(component.actorSearchFilter).toBe('My actor');
  });

  it('should run GetterDeclaration #errorControl', async () => {
    component.movieForm = component.movieForm || {};
    component.movieForm.controls = 'controls';
    const errorControl = component.errorControl;
    expect(errorControl).toBe('controls');
  });

  it('should run #ngOnInit()', async () => {
    component.isNew = true;

    component.formBuilder = component.formBuilder || {};
    component.formBuilder.group = jest.fn();
    component.ngOnInit();

    expect(component.movieService.getMovie).not.toHaveBeenCalled();
    expect(component.auth.can).toHaveBeenCalled();
    expect(component.formBuilder.group).toHaveBeenCalled();
    expect(component.movie.id).toBe(-1);
    expect(component.movie.actor_ids).toStrictEqual([]);
    expect(component.movie.actors).toStrictEqual([]);
    expect(component.movie.title).toBe('');
    expect(component.movie.release_date).toBe('');

  });

  it('should run #ngOnInit() for new', async () => {
    component.isNew = false;

    component.formBuilder = component.formBuilder || {};
    component.formBuilder.group = jest.fn();
    component.ngOnInit();
    expect(component.movieService.getMovie).toHaveBeenCalled();
    expect(component.auth.can).toHaveBeenCalled();
    expect(component.formBuilder.group).toHaveBeenCalled();
    expect(component.movie.id).toBe(1);
  });


  it('should run #searchActor() on setting actorFilter', async () => {
    component.searchActor = jest.fn();
    component.actorFilter = 'my actor';

    expect(component.searchActor).toHaveBeenCalled();
  });

  it('should run #searchActor()', async () => {
    artistService.searchActor = jest.fn();
    component.actorFilter = '';

    expect(artistService.searchActor).not.toBeCalled();
    expect(component.filteredActors).toBeUndefined();
  });

  it('should run #handleSearchBar()', async () => {
    component.searchActor = jest.fn();
    component.handleSearchBar({target: {value: 'my search term'}});

    expect(component.actorFilter).toBe('my search term');
    expect(component.searchActor).toHaveBeenCalled();
    expect(component.searchActor).toHaveBeenCalledTimes(1);
  });

  it('should run #customTrackBy()', async () => {
    const trackIndex = component.customTrackBy(2);
    expect(trackIndex).toBe(2);
  });

  it('should run #addActor()', async () => {
    const actor = {id: 4, name: 'Emma'};
    component.movie = component.movie || {};
    component.movie.actors = [];
    component.movie.actor_ids = [];
    component.filteredActors = component.filteredActors || {};
    component.filteredActors.splice = jest.fn();
    component.addActor(actor, 4);
    expect(component.filteredActors.splice).toHaveBeenCalled();
    expect(component.filteredActors.splice).toHaveBeenCalledWith(4, 1);
    expect(component.movie.actor_ids).toContain(4);
    expect(component.movie.actors.length).toEqual(1);
  });

  it('should run #removeActor()', async () => {
    component.movie = component.movie || {};

    component.movie.actor_ids = [4];
    component.movie.actors = [{actor: {id: 4, name: 'Emma'}}];

    component.removeActor(0);
    expect(component.movie.actors.length).toEqual(0);
    expect(component.movie.actor_ids.length).toEqual(0);
  });

  it('should run #closeModal()', async () => {
    component.modalCtrl = component.modalCtrl || {};
    component.modalCtrl.dismiss = jest.fn();
    await component.closeModal();
    expect(component.modalCtrl.dismiss).toHaveBeenCalled();
  });

  it('should run #saveMovie()', async () => {
    component.movieForm = component.movieForm || {};
    component.movieForm.valid = 'valid';
    component.movieForm.value = mockedMovie;
    component.movie = component.movie || mockedMovie;
    component.closeModal = jest.fn();
    component.saveMovie();
    expect(component.movieService.saveMovie).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should not run movieService.saveMovie on invalid form #saveMovie', () => {
    component.movieForm = {};
    component.movieForm.valid = false;

    component.saveMovie();
    expect(movieService.saveMovie).not.toBeCalled();
  });

  it('should run return error on #saveMovie() failure', async () => {

    const errorResponse = {error: {message: 'error message'}, loading: false};
    const spy = jest.spyOn(movieService, 'saveMovie');
    spy.mockReturnValue(throwError(errorResponse));

    component.movieForm = component.movieForm || {};
    component.movieForm.valid = 'valid';
    component.movieForm.value = component.movie;

    component.closeModal = jest.fn();
    component.saveMovie();

    expect(component.movieService.saveMovie).toHaveBeenCalled();
    expect(component.closeModal).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe(errorResponse.error.message);
  });

  it('should run #deleteClickedMovie()', async () => {
    component.movie = component.movie || {};
    component.movie.id = 'id';
    component.closeModal = jest.fn();
    await component.deleteClickedMovie();
    expect(component.movieService.deleteMovie).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

});
