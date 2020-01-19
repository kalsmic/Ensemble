import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';

import {AuthService} from './auth.service';
import {ToastService} from './toast.service';


@NgModule({
    imports: [CommonModule, IonicModule],
    exports: [CommonModule, IonicModule],
    declarations: [],
    providers: [AuthService, ToastService]
})

export class CoreModule {
}
