import { Component, OnInit } from '@angular/core';
import { ChartService } from './chart.service';


@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    providers: [ChartService],
})
export class ChartComponent implements OnInit {
    public ciData;
    public ecData;

    constructor(private chartService: ChartService) { }

    ngOnInit() {
        this.refresh();
        setInterval(() => this.refresh(), 3600000);
    }

    refresh() {
        this.chartService.getCiData().subscribe(
            data => this.ciData = data,
            error => console.error(error)
        );
        this.chartService.getEcData().subscribe(
            data => {
                this.ecData = data;
                this.ecData.devinfo.stat_c_15764 = 0;
                this.ecData.devinfo.stat_c_15765 = 0;
                for (let item of this.ecData.devinfo.rows) {
                    this.ecData.devinfo.stat_c_15764 += Number(item.c_15764);
                    this.ecData.devinfo.stat_c_15765 += Number(item.c_15765);
                };
				for (let item of this.ecData.ccbinfo.rows) {
					for (let i in this.barChartLabels) {
						if (item.c_15772 === this.barChartLabels[i]) {
							this.barChartData[0].data[i] = item.c_15768;
							this.barChartData[1].data[i] = item.c_15769;
							this.barChartData[2].data[i] = item.c_15770;
							this.barChartData[3].data[i] = item.c_15771;
						}
					}
				};
            },
            error => console.error(error)
        );
    }

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = ['待技术审核', '待批准', '待验证', '已验证延期'];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [
		{data: [0, 0, 0, 0], label: '待CCB处理变更请求数'},
		{data: [0, 0, 0, 0], label: '待CCB处理变更活动数'},
		{data: [0, 0, 0, 0], label: '待CCB处理变更请求数（已超期）'},
		{data: [0, 0, 0, 0], label: '待CCB处理变更活动数（已超期）'},
	];

	public barChartColors:Array<any> = [
		{
			backgroundColor: 'green',
		},
		{
			backgroundColor: 'powderblue',
		},
		{
			backgroundColor: 'wheat',
		},
		{
			backgroundColor: 'pink',
		},
	];

	// events
	public chartClicked(e: any): void {
		console.log(e);
	}

	public chartHovered(e: any): void {
		console.log(e);
	}
}
