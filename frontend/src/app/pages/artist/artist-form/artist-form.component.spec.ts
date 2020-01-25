import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularDelegate, ModalController} from '@ionic/angular';

import {AuthService} from 'src/app/core/auth.service';
import {ArtistService} from 'src/app/pages/artist/artist.service';
import {ArtistServiceSpy, AuthServiceSpy, modalControllerSpy} from '../../../shared/__mocks__/index.mock';
import {ArtistFormComponent} from './artist-form.component';

describe('ArtistFormComponent', () => {
    let fixture;
    let component;

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
        component = fixture.debugElement.componentInstance;
        component.modalCtrl = modalControllerSpy;


    });

    afterEach(() => {
        fixture.destroy();
        jest.resetAllMocks();
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

});
