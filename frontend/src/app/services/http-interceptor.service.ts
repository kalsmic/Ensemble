import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {ToastService} from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
        private toast: ToastService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authenticatedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.authService.activeJWT()}`
            }
        });
        return next.handle(authenticatedRequest).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.error instanceof ErrorEvent) {
                    } else {
                        console.log(`error status : ${error.status} ${error.statusText}`);
                        switch (error.status) {
                            case 401:      // Authentication, login
                                this.router.navigateByUrl('/tabs/user-page');
                                break;
                            case 403:     // forbidden action,
                                this.toast.error(error.error.message);
                                break;
                            case 400:
                            case 409:
                                this.toast.error(error.error.message);
                                break;

                        }
                    }
                } else {
                    console.error('Ooops! ,Something went wrong!');
                }

                return throwError(error);
            })
        );
    }

}
