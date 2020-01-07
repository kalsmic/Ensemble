import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toastRef;

    constructor(private toastController: ToastController) {
    }

    async showToast(message, color = 'dark') {
        const toast = await this.toastController.create({
            message,
            position: 'top',
            color,
            duration: 3000,
        });
        toast.present();
    }

}
