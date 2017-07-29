import { Component, OnInit } from '@angular/core';
import { CiService } from './../ci/ci.service';

@Component({
    selector: 'app-gitbr',
    templateUrl: './gitbr.component.html',
    styleUrls: ['./gitbr.component.css'],
})
export class GitbrComponent implements OnInit {
    public ciData;

    constructor(private ciService: CiService) { }

    ngOnInit() {
        // this.ciService.httpObservable.subscribe(
        //     data => this.refresh(data),
        //     error => console.log(error),
        //     () => console.log('complete')
        // );

        this.ciService.wsSubject.retryWhen(
            errors => errors.delay(1000)
        ).subscribe(
            data => this.refresh(data),
            error => console.log(error),
            () => console.log('complete')
        );
    }

    refresh(data): any {
        this.ciData = data;
        this.ciData.feature_st_history = this.ciData.feature_st_history.sort(
            (x, y) => x[4].localeCompare(y[4])
        )
        
    }
}
