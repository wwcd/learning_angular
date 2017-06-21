import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { PiplineComponent } from './pipline/pipline.component';
import { EcComponent } from './ec/ec.component';
import { CiComponent } from './ci/ci.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        NgbModule.forRoot(),
        ChartsModule,
    ],
    declarations: [
        AppComponent,
        PiplineComponent,
        EcComponent,
        CiComponent,
    ],
    providers: [HttpModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
