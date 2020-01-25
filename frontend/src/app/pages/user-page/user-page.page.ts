import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../core/auth.service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.page.html',
    styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {
    loginURL: string;

    constructor(public auth: AuthService) {
        this.loginURL = auth.buildLoginLink('/tabs/user-page');
    }

    ngOnInit() {
    }

}
