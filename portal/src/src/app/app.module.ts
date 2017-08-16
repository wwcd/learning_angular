import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { PiplineComponent } from './pipline/pipline.component';
import { LinksComponent } from './pipline/links/links.component';
import { EcComponent } from './ec/ec.component';
import { CiComponent } from './ci/ci.component';
import { GitbrComponent } from './gitbr/gitbr.component';
import { CiService } from './ci/ci.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        NgbModule.forRoot(),
        ChartsModule,
        RouterModule.forRoot(
            []
        ),
    ],
    declarations: [
        AppComponent,
        PiplineComponent,
        LinksComponent,
        EcComponent,
        CiComponent,
        GitbrComponent,
    ],
    providers: [HttpModule, CiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
