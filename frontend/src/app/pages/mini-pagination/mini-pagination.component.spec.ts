import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MiniPaginationComponent} from './mini-pagination.component';

describe('MiniPaginationComponent', () => {
    let fixture;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [
                MiniPaginationComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: []
        }).compileComponents();
        fixture = TestBed.createComponent(MiniPaginationComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should run #constructor()', async () => {
        expect(component).toBeTruthy();
    });


    it('should run #getPageNumber()', async () => {
        component.goToPage = component.goToPage || {};
        component.goToPage.emit = jest.fn();
        component.getPageNumber(1);
        expect(component.goToPage.emit).toHaveBeenCalled();
        expect(component.goToPage.emit).toHaveBeenCalledWith(1);
    });

});
