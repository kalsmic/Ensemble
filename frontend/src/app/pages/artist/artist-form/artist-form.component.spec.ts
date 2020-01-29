import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {getTestBed, TestBed} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularDelegate, ModalController} from '@ionic/angular';
import {throwError} from 'rxjs';

import {AuthService} from 'src/app/core/auth.service';
import {ArtistService} from 'src/app/pages/artist/artist.service';
import {ArtistServiceSpy, AuthServiceSpy, modalControllerSpy} from '../../../shared/__mocks__/index.mock';
import {ArtistFormComponent} from './artist-form.component';


describe('ArtistFormComponent', () => {
    let fixture,
        component,
        artistService: ArtistService,
        currentActor,
        newActor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [
                ArtistFormComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AngularDelegate,
                {provide: AuthService, useClass: AuthServiceSpy},
                ModalController,
                {provide: ArtistService, useClass: ArtistServiceSpy},
                FormBuilder
            ]
        }).overrideComponent(ArtistFormComponent, {}).compileComponents();
        fixture = TestBed.createComponent(ArtistFormComponent);
        artistService = getTestBed().get(ArtistService);
        component = fixture.debugElement.componentInstance;
        component.modalCtrl = modalControllerSpy;

        currentActor = {birth_date: '2019-01-02', gender: 'M', id: 1, name: 'Arthur'};
        newActor = {birth_date: '', gender: 'M', id: -1, name: ''};

    });

    afterEach(() => {
        fixture.destroy();
        jest.clearAllMocks();
    });

    it('should run #constructor()', async () => {
        expect(component).toBeTruthy();
    });

    it('should run GetterDeclaration #errorControl', async () => {
        component.actorForm = component.actorForm || {};
        component.actorForm.controls = 'controls';
        const errorControl = component.errorControl;
        expect(errorControl).toBe('controls');

    });


    it('should run #ngOnInit()', async () => {
        component.isNew = true;
        component.formBuilder.group = jest.fn();
        component.ngOnInit();
        expect(component.auth.can).toHaveBeenCalled();
        expect(component.formBuilder.group).toHaveBeenCalled();
        expect(component.artist).toStrictEqual(newActor);

    });

    it('should set current artist on #ngOnInit() ', async () => {
        component.artist = currentActor;
        component.isNew = false;
        component.formBuilder.group = jest.fn();
        component.ngOnInit();
        expect(component.auth.can).toHaveBeenCalled();
        expect(component.formBuilder.group).toHaveBeenCalled();
        expect(component.artist).toStrictEqual(currentActor);
        expect(component.artist).not.toMatchObject(newActor);

    });

    it('should run #closeModal()', async () => {
        component.closeModal();
        expect(component.modalCtrl.dismiss).toHaveBeenCalled();
    });

    it('should run #deleteArtist()', async () => {
        component.closeModal = jest.fn();
        component.deleteArtist();
        expect(component.artistService.deleteArtist).toHaveBeenCalled();
        expect(component.closeModal).toHaveBeenCalled();
    });

    it('should run #saveArtist()', async () => {
        component.actorForm = component.actorForm || {};
        component.actorForm.valid = 'valid';
        component.actorForm.value = 'value';
        component.artist = component.artist || {};
        component.artist.name = 'name';
        component.artist.birth_date = 'birth_date';
        component.artist.gender = 'gender';

        component.closeModal = jest.fn();
        await component.saveArtist();

        expect(component.artistService.saveArtist).toHaveBeenCalled();
        expect(component.closeModal).toHaveBeenCalled();
    });

    it('should return errors on if any on #saveArtist', async () => {
        const errorResponse = {error: {message: 'error message'}, loading: false};
        const spy = jest.spyOn(artistService, 'saveArtist');
        spy.mockReturnValue(throwError(errorResponse));
        const actor = {name: 'name', birth_date: '2019-01-01', gender: 'gender'};
        component.artist = component.artist || {id: -1, name: '', gender: '', birth_date: ''};

        component.actorForm = component.actorForm || {};
        component.actorForm.valid = true;
        component.actorForm.value = actor;
        component.closeModal = jest.fn();

        await component.saveArtist();
        expect(component.errorMessage).toEqual('error message');
        expect(component.loading).toBeFalsy();
        expect(component.closeModal).not.toHaveBeenCalled();
    });


    it('should run not call  #ArtistService.saveArtist on invalid form', async () => {
        component.actorForm = component.actorForm || {};
        component.actorForm.valid = false;

        await component.saveArtist();

        expect(artistService.saveArtist).not.toBeCalled();
        component.actorForm.controls = 'controls';
        const errorControl = component.errorControl;
        expect(errorControl).toBe('controls');

    });

});
