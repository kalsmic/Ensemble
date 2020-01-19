import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {CoreModule} from '../../core/core.module';
import {TabsPage} from './tabs.page';
import {TabsPageRoutingModule} from './tabs.router.module';

@NgModule({
    imports: [
        IonicModule,
        CoreModule,
        FormsModule,
        TabsPageRoutingModule,
    ],
    declarations: [TabsPage]
})
export class TabsPageModule {
}
