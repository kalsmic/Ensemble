import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

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

    success(message) {
        this.showToast(message, 'tertiary').then();
    }

    error(message) {
        return this.showToast(message, 'danger').then();
    }

}
