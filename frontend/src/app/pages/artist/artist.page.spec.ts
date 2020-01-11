import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ArtistPage} from './artist.page';

describe('ArtistPage', () => {
    let component: ArtistPage;
    let fixture: ComponentFixture<ArtistPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ArtistPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ArtistPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
