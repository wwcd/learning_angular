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
        this.refresh();
        setInterval(() => this.refresh(), 3600000);
    }

    refresh() {
        this.ciService.getCiData().subscribe(
            data => this.ciData = data,
            error => console.error(error)
        );
    }
}
