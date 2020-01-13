import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toastRef;

    constructor(private toastController: ToastController) {
    }

    async showToast(message, color) {
        const toast = await this.toastController.create({
            message,
            position: 'top',
            color,
            duration: 3000,
        });
        await toast.present();
    }

    async success(message) {
        await this.showToast(message, 'dark');
    }

    async error(message) {
        await this.showToast(message, 'danger');
    }

}
