import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CiService {

    constructor(private _http: Http) { }

    getCiData() {
        return this._http.get('/api/v1/ci').map(res => res.json());
    }
}
