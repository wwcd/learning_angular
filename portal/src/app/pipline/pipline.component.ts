import { Component, OnInit } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { PiplineService } from './pipline.service';

@Component({
    selector: 'app-pipline',
    templateUrl: './pipline.component.html',
    providers: [PiplineService],
})
export class PiplineComponent implements OnInit {
    private pipline: Array<any> = [null, null];

    constructor(private piplineService: PiplineService) { }

    ngOnInit() {
        this.refresh();
        setInterval(() => this.refresh(), 1000);
    }

    refresh() {
        this.piplineService.getBuild().subscribe(
            data => this.pipline[0] = data[0],
            error => console.error(error)
        );
        this.piplineService.getBuildAll().subscribe(
            data => this.pipline[1] = data[0],
            error => console.error(error)
        );
    }

    duration(_stage: any): string {
        let seconds = 0;

        if (_stage.durationMillis > 0 && _stage.startTimeMillis > 0) {
            seconds = Math.ceil(_stage.durationMillis / 1000);
        }

        if (_stage.pauseDurationMillis < 0) {
            seconds = 0;
        }

        let H = Math.round((seconds - 30 * 60) / (60 * 60));
        let M = Math.round((seconds - 30) / 60) % 60;
        let S = seconds % 60;

        function _t(n: number, s: string): string {
            return n > 0 ? n + s : "";
        }

        return _t(H, "时") + _t(M, "分") + _t(S, "秒");
    }

    status(_stage: any): any {
        if (_stage.pauseDurationMillis >= 0) {
            if (_stage.startTimeMillis > 0 && _stage.durationMillis > 0) {
                if (_stage.status == 'IN_PROGRESS') {
                    return {
                        status:'PROGRESSING',
                        type: "info",
                        striped: true,
                        animated: true
                    };
                } else if (_stage.status == 'SUCCESS') {
                    return {
                        status:'SUCCESS',
                        type: "success",
                        striped: false,
                        animated: false
                    };
                }
            }
            if (_stage.status == 'FAILED') {
                    return {
                        status:'FAILED',
                        type: "danger",
                        striped: false,
                        animated: false
                    };
            }
        }

        return {
            status:'PAUSING',
            type: "warning",
            striped: true,
            animated: true
        };
    }
}
