import {Component} from '@angular/core';

import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Platform} from '@ionic/angular';

import {AuthService} from './core/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
        private auth: AuthService,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
    ) {
        this.initializeApp();
    }


    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            // perform authentication actions
            this.auth.load_jwts();
            this.auth.check_token_fragment();
        });
    }

}
