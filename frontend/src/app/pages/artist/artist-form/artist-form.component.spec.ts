import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ArtistFormComponent} from './artist-form.component';

describe('ArtistFormComponent', () => {
    let component: ArtistFormComponent;
    let fixture: ComponentFixture<ArtistFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ArtistFormComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ArtistFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
