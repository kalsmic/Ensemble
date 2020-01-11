import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from './services/auth.service';
import {ArtistService} from './services/artist.service';
import {MovieService} from './services/movie.service';


import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ToastService} from './services/toast.service';
import {AuthGuard} from './shared/auth.guard';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        BrowserAnimationsModule,


    ],
    providers: [
        StatusBar,
        SplashScreen,
        AuthService,
        ArtistService,
        MovieService,
        ToastService,
        AuthGuard,

        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
