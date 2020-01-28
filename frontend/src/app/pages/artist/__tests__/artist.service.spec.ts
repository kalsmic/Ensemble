import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

import {AuthService} from '../../../core/auth.service';
import {ToastService} from '../../../core/toast.service';
import {actors, MockToastService, paginationMock} from '../../../shared/__mocks__/index.mock';
import {ArtistService} from '../artist.service';

describe('ArtistService', () => {
    let service: ArtistService, toast: ToastService;
    let httpMock;
    const url = environment.apiServerUrl;

    const routerMock = () => {
    };
    const authMock = {can: () => true};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],

            providers: [
                ArtistService,
                {provide: Router, useValue: routerMock},
                {provide: ToastService, useValue: MockToastService},
                {provide: AuthService, useValue: authMock}
            ]
        });
        service = TestBed.get(ArtistService);
        httpMock = getTestBed().get(HttpTestingController);
        toast = getTestBed().get(ToastService);
        toast.success = jest.fn();

    });

    afterEach(() => {
        httpMock.verify();
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should run #getArtists', () => {
        service.getArtists();
        const req = httpMock.expectOne(`${url}/actors?page=1`);
        expect(req.request.method).toBe('GET');
        req.flush({actors, ...paginationMock});
    });

    it('should run #postArtist', () => {
        const newActor = {...actors[0]};
        newActor.id = -1;
        service.saveArtist(newActor).subscribe();

        const req = httpMock.expectOne(`${url}/actors`);
        expect(req.request.method).toBe('POST');
        req.flush({
            actor: {...actors[0]},
            message: 'success message', success: true, loading: true
        });
        expect(service.success).toBeTruthy();
        expect(toast.success).toBeCalledWith('success message');

    });

    it('should run #patchArtist', () => {
        service.saveArtist(actors[1]).subscribe();
        const req = httpMock.expectOne(`${url}/actors/2`);
        expect(req.request.method).toBe('PATCH');
        req.flush({actor: actors[1], message: 'Edited successfully', success: true});
        expect(toast.success).toBeCalledWith('Edited successfully');
    });

    it('should run #deleteArtist', () => {
        service.deleteArtist(actors[1]);
        const req = httpMock.expectOne(`${url}/actors/2`);
        expect(req.request.method).toBe('DELETE');
        req.flush({message: 'Deleted Actor', success: true});
        expect(toast.success).toBeCalledWith('Deleted Actor');
    });

    it('should run #searchActor', () => {
        let searchResults = {};
        service.searchActor('james').subscribe(data => searchResults = data);
        const req = httpMock.expectOne(`${url}/actors/search`);
        expect(req.request.method).toBe('POST');
        req.flush({actors});
        expect(service.loading).toBeFalsy();
        expect(searchResults).toMatchObject(actors);

    });
});
