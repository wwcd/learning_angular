import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from './app.service'
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [AppService],
})
export class AppComponent  implements OnInit {
    public option = 0;
    public dynamic = true;
    public subscription: Subscription;

    constructor(private _route: ActivatedRoute) { }

    ngOnInit() {
        this.subscription = Observable.interval(10000).subscribe(
            x => {
                this.option++;
            }
        )
        this._route.queryParams.subscribe(
            x => {
                let interval = parseInt(x.interval);
                if (interval === interval) {
                    this.subscription.unsubscribe();
                    this.subscription = Observable.interval(interval * 1000).subscribe(
                        x => {
                            this.option++;
                        }
                    )
                }
                if ('dynamic' in x) {
                    this.dynamic = x.dynamic === 'true'
                }
            }
        )
    }
}
