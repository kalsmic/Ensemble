import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AngularDelegate, ModalController} from '@ionic/angular';
import {of as observableOf} from 'rxjs';

import {AuthService} from '../../../core/auth.service';
import {ArtistServiceSpy, AuthServiceSpy, MovieServiceSpy} from '../../../shared/__mocks__';
import {ArtistService} from '../../artist/artist.service';
import {MovieService} from '../movie.service';
import {MovieFormComponent} from './movie-form.component';


describe('MovieFormComponent', () => {
  let fixture;
  let component;

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
    component.searchActor = jest.fn().mockReturnValue(observableOf({}));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #actorFilter', async () => {
    component.actorFilter = 'My actor';
    expect(component.actorSearchFilter).toBe('My actor');
  });

  it('should run GetterDeclaration #errorControl', async () => {
    component.movieForm = component.movieForm || {};
    component.movieForm.controls = 'controls';
    const errorControl = component.errorControl;
    expect(errorControl).toBe('controls');
  });

  it('should run #ngOnInit()', async () => {
    component.movie = component.movie || {};
    component.movie.id = 'id';
    component.movie.actors = 'actors';
    component.movie.actor_ids = 'actor_ids';
    component.movie.title = 'title';
    component.movie.release_date = 'release_date';

    component.formBuilder = component.formBuilder || {};
    component.formBuilder.group = jest.fn();
    component.ngOnInit();
    expect(component.movieService.getMovie).toHaveBeenCalled();
    expect(component.auth.can).toHaveBeenCalled();
    expect(component.formBuilder.group).toHaveBeenCalled();
  });

  it('should run #searchActor()', async () => {
    component.actorFilter = 'my actor';
    expect(component.searchActor).toHaveBeenCalled();
  });

  it('should run #handleSearchBar()', async () => {
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
    component.movieForm.value = 'value';
    component.movie = component.movie || {};
    component.movie.title = 'title';
    component.movie.release_date = 'release_date';
    component.closeModal = jest.fn();
    component.saveMovie();
    expect(component.movieService.saveMovie).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
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
