import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EcService {

    constructor(private _http: Http) { }

    getEcData() {
        return this._http.get('/api/v1/ec').map(res => res.json());
    }

}
