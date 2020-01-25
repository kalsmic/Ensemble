import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PaginationComponent} from './pagination.component';

describe('PaginationComponent', () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaginationComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should run #getPageNumber()', async () => {
        const mockEvent = {target: {value: 1}};
        component.goToPage.emit = jest.fn();

        component.getPageNumber(mockEvent);
        expect(component.goToPage.emit).toHaveBeenCalled();
        expect(component.goToPage.emit).toHaveBeenCalledWith(1);
    });
});
