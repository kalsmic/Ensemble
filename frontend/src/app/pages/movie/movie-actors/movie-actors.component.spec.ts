import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MovieActorsComponent} from './movie-actors.component';

describe('MovieActorsComponent', () => {
    let component: MovieActorsComponent;
    let fixture: ComponentFixture<MovieActorsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MovieActorsComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MovieActorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
