import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChartService {

    constructor(private _http: Http) { }

    getCiData() {
        return this._http.get('/api/v1/ci').map(res => res.json());
    }

    getEcData() {
        return this._http.get('/api/v1/ec').map(res => res.json());
    }
}
