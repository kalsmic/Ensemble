import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MovieFormComponent} from './movie-form.component';

describe('MovieFormComponent', () => {
    let component: MovieFormComponent;
    let fixture: ComponentFixture<MovieFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MovieFormComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MovieFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
