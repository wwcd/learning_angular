import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { PiplineService } from './pipline.service';

@Component({
    selector: 'app-pipline',
    templateUrl: './pipline.component.html',
    providers: [PiplineService],
})
export class PiplineComponent implements OnInit {
    public pipline: Array<any> = [null, null];

    constructor(private piplineService: PiplineService) { }

    ngOnInit() {
        this.piplineService.httpObservable.subscribe(
            data => this.refresh(data),
            error => console.log(error),
            () => console.log('complete')
        );

        this.piplineService.wsSubject.retryWhen(
            errors => errors.delay(1000)
        ).subscribe(
            data => this.refresh(data),
            error => console.log(error),
            () => console.log('complete')
        );
    }

    refresh(data: any): void {
        this.pipline[0] = [data.verify[0]];
        this.pipline[1] = [data.single[0]];
        this.pipline[2] = [data.client[0]];
        this.pipline[3] = [data.v4comm[0]];
    }
}
