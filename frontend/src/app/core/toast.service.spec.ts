import {TestBed} from '@angular/core/testing';
import {ToastController} from '@ionic/angular';
import {modalControllerSpy} from '../shared/__mocks__/index.mock';

import {ToastService} from './toast.service';

describe('ToastService', () => {
    let service, showToastMock;

    beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastController]

    });
    service = TestBed.get(ToastService);
    showToastMock = jest.fn().mockResolvedValue('');
  });

    afterEach(() => jest.clearAllMocks());

    it('should be created', () => {
    expect(service).toBeTruthy();
  });

    it('should run #showToast()', async () => {
        service.toastController = modalControllerSpy;
        await service.showToast('message', 'success');
        expect(service.toastController.create).toHaveBeenCalled();
        expect(service.toastController.create).toHaveBeenCalledWith({
            color: 'success', duration: 3000, message: 'message', position: 'top'
        });
    });

    it('should run #success()', async () => {
        service.showToast = showToastMock;
        service.success('success message');
        expect(service.showToast).toHaveBeenCalled();
        expect(service.showToast).toHaveBeenCalledWith('success message', 'tertiary');

  });

    it('should run #error()', async () => {
        service.showToast = showToastMock;
        service.error('error message');
        expect(service.showToast).toHaveBeenCalled();
        expect(service.showToast).toHaveBeenCalledWith('error message', 'danger');
  });

});
