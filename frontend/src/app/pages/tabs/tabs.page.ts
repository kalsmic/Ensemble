import {Component} from '@angular/core';
import {AuthService} from '../../core/auth.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    constructor(public auth: AuthService) {

    }
}
