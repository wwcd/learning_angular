import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [AppService],
})
export class AppComponent  implements OnInit { 
    private _ival: Observable<any>;
    public option = 0;

    constructor() {
        this._ival = Observable.interval(5000);
    }

    ngOnInit() {
		this._ival.subscribe(
			x => {
				this.option++;
			}
		) 
	}
}
