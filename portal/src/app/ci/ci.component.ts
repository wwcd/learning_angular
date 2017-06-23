import { Component, OnInit } from '@angular/core';
import { CiService } from './ci.service';

@Component({
    selector: 'app-ci',
    templateUrl: './ci.component.html',
    providers: [CiService],
})
export class CiComponent implements OnInit {
    public ciData;

    constructor(private ciService: CiService) { }

    ngOnInit() {
        this.ciService.httpObservable.subscribe(
            data => this.refresh(data),
            error => console.log(error),
            () => console.log('complete')
        );

        this.ciService.wsSubject.retry().subscribe(
            data => this.refresh(data),
            error => console.log(error),
            () => console.log('complete')
        );
    }

    refresh(data): any {
        this.ciData = data;
    }
}
