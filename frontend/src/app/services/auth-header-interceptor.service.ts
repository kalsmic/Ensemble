import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {AuthService} from '../core/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthHeaderInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authenticatedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.authService.activeJWT()}`,

            }
        });
        return next.handle(authenticatedRequest);
    }

}
