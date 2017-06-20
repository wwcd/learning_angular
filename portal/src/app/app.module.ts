import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { PiplineComponent } from './pipline/pipline.component';
import { ChartComponent } from './chart/chart.component';

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
        ChartComponent,
    ],
    providers: [HttpModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
