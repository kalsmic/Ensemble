import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthService} from '../core/auth.service';
import {ToastService} from '../core/toast.service';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
        private toast: ToastService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error) => {
                console.log(`error status : ${error.status} ${error.statusText}`);
                if (error.error instanceof ErrorEvent) {
                    this.toast.error('Something unexpected happened, Please check your network connection').then();
                } else {

                    switch (error.status) {
                        case 401:      // Authentication, login
                            this.toast.error(error.error.message).then();

                            this.router.navigateByUrl('/tabs/user-page').then(() => {
                                this.authService.logout();
                            });
                            break;
                        case 403:
                        case 400:
                        case 409:
                            this.toast.error(error.error.message).then(() => {
                            });
                            break;
                        case 500:
                            this.toast.error('Something went wrong, make sure you are connected').then();
                            break;
                        default:
                            this.toast.error('Oops! ,Something went wrong!').then();
                    }
                }

                return throwError(error.error || error.statusText);
            })
        );

    }
}
