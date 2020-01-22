// tslint:disable
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularDelegate, ModalController} from '@ionic/angular';

import {AuthService} from 'src/app/core/auth.service';
import {ArtistService} from 'src/app/pages/artist/artist.service';
import {ArtistServiceSpy, AuthServiceSpy, modalControllerSpy} from '../../shared/__mocks__';
import {ArtistPage} from './artist.page';

describe('ArtistPage', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        ArtistPage,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        AngularDelegate,
        {provide: AuthService, useClass: AuthServiceSpy},
        ModalController,
        {provide: ArtistService, useClass: ArtistServiceSpy}
      ]
    }).overrideComponent(ArtistPage, {}).compileComponents();
    fixture = TestBed.createComponent(ArtistPage);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.ngOnInit();
    expect(component.artists.getArtists).toHaveBeenCalled();
  });

  it('should run #openArtistForm()', async () => {
    component.modalCtrl = modalControllerSpy;
    component.auth.can.mockReturnValue(true);
    await component.openArtistForm();
    expect(component.auth.can).toHaveBeenCalled();
    expect(component.modalCtrl.create).toHaveBeenCalled();
  });

  it('should run #navigateToPage()', async () => {
    component.navigateToPage(1);
    expect(component.artists.getArtists).toHaveBeenCalled();
    expect(component.artists.getArtists).toHaveBeenCalledWith(1);
  });

});
