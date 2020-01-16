import {TestBed} from '@angular/core/testing';

import {ArtistService} from '../artist.service';
import {HttpClientModule} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastService} from '../toast.service';
import {AuthService} from '../auth.service';

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
