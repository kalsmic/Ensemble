import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy} from '@angular/router';
import {JwtModule} from '@auth0/angular-jwt';

import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {AuthHeaderInterceptorService} from './services/auth-header-interceptor.service';
import {HttpErrorInterceptorService} from './services/http-error-interceptor.service';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        CoreModule,
        JwtModule.forRoot({}),

    ],
    providers: [
        StatusBar,
        SplashScreen,

        {provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptorService, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorService, multi: true},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
