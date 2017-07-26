import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.css'],
    inputs: ['links', 'alias'],
})
export class LinksComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    fmtTime(ms: number): string {
        let seconds = 0;

        seconds = Math.ceil(ms / 1000);

        let H = Math.round((seconds - 30 * 60) / (60 * 60));
        let M = Math.round((seconds - 30) / 60) % 60;
        let S = seconds % 60;

        function _t(n: number, s: string): string {
            return n > 0 ? n + s : "";
        }

        return _t(H, "时") + _t(M, "分") + _t(S, "秒");
    }

    duration(_stage: any): string {
        let ms = 0;

        if (_stage.durationMillis > 0 && _stage.startTimeMillis > 0) {
            ms = _stage.durationMillis; 
        }

        if (_stage.pauseDurationMillis < 0) {
            ms = 0;
        }

        return this.fmtTime(ms);
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

    jobinfo(parameters: Array<any>): string {
        if (parameters === undefined) {
            return "None"
        }
        return parameters.filter(
            x => [
                'GERRIT_CHANGE_NUMBER', 
                'GERRIT_BRANCH', 
                'GERRIT_CHANGE_OWNER_NAME'
            ].indexOf(x.name) != -1
        ).map(
            x => x.value
        ).join()
    }
}
