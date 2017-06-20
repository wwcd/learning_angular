import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PiplineService {

    constructor(private _http: Http) { }

    getBuild() {
        return this._http.get(
            '/vmanager/job/gerrit_VNFM-G_verify/wfapi/runs?fullStages=true'
        ).map(res => res.json());
    }

    getBuildAll() {
        return this._http.get(
            '/vmanager/job/build_vManager_singleBranch_pipeline/wfapi/runs?fullStages=true'
        ).map(res => res.json());
    }
}
