import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MiniPaginationComponent} from './mini-pagination.component';

describe('MiniPaginationComponent', () => {
    let component: MiniPaginationComponent;
    let fixture: ComponentFixture<MiniPaginationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MiniPaginationComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MiniPaginationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
