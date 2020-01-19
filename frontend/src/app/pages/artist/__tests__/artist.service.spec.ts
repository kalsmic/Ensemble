import {HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';

import {AuthService} from '../../../core/auth.service';
import {ToastService} from '../../../core/toast.service';
import {ArtistService} from '../artist.service';

describe('ArtistService', () => {
    let service: ArtistService;
    const toastServiceMock = {
        toast: {
            success: () => {
            }, error: () => {
            }
        }
    };
    const routerMock = () => {
    };
    const authMock = {can: () => true};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                ArtistService,
                {provide: Router, useValue: routerMock},
                {provide: ToastService, useValue: toastServiceMock},
                {provide: AuthService, useValue: authMock}
            ]
        });
        service = TestBed.get(ArtistService);
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
