import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {mockRouter} from '../../shared/__mocks__/index.spec';

import {TabsPage} from './tabs.page';

describe('TabsPage', () => {
    let component: TabsPage;
    let fixture: ComponentFixture<TabsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TabsPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{provide: Router, useValue: mockRouter}]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TabsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
