import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AuthService} from '../../core/auth.service';
import {AuthServiceSpy} from '../../shared/__mocks__/index.mock';
import {TabsPage} from './tabs.page';

describe('TabsPage', () => {
  let fixture: ComponentFixture<TabsPage>;
  let component: TabsPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        TabsPage,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {provide: AuthService, useClass: AuthServiceSpy},
      ]
    }).overrideComponent(TabsPage, {}).compileComponents();
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

});
