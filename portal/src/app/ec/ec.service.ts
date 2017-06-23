import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/observable/dom/WebSocketSubject';

@Injectable()
export class EcService {
    public wsSubject: WebSocketSubject<any>;
    public httpObservable: Observable<any>;

    constructor(private _http: Http) {
        let config: WebSocketSubjectConfig = {
            url: 'ws://' + window.location.host + '/websocket/ec',
            closeObserver: {
                next: (e: CloseEvent) => {
                    console.error('Close ec ws !!!');
                }
            },
        }
        this.wsSubject = Observable.webSocket(config);
        this.httpObservable = this._http.get('/api/v1/ec').map(res => res.json());
    }
}
