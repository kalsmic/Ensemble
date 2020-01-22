import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ToastController} from '@ionic/angular';

import {ToastService} from './toast.service';

describe('ToastService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ToastController]

    });
    service = TestBed.get(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run #success()', async () => {
    service.showToast = jest.fn().mockReturnValue({
      then() {
      }
    });
    service.success({});
    expect(service.showToast).toHaveBeenCalled();
  });

  it('should run #error()', async () => {
    service.showToast = jest.fn().mockReturnValue({
      then() {
      }
    });
    service.error({});
    expect(service.showToast).toHaveBeenCalled();
  });

});
