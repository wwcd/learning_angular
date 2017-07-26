import { Component, OnInit } from '@angular/core';
import { EcService } from './ec.service';

@Component({
    selector: 'app-ec',
    templateUrl: './ec.component.html',
    styleUrls: ['./ec.component.css'],
    providers: [EcService],
})
export class EcComponent implements OnInit {
    public ecData: any;

    constructor(private ecService: EcService) { }

    ngOnInit() {
        this.ecService.httpObservable.subscribe(
            data => this.refresh(data),
            error => console.log(error),
            () => console.log('complete')
        );

        this.ecService.wsSubject.retryWhen(
            errors => errors.delay(1000)
        ).subscribe(
            data => this.refresh(data),
            error => console.log(error),
            () => console.log('complete')
        );
    }

    refresh(data: any): void {
        this.ecData = data;
        this.ecData.devinfo.stat_c_16523 = 0;
        this.ecData.devinfo.stat_c_16524 = 0;
        for (let item of this.ecData.devinfo.rows) {
            this.ecData.devinfo.stat_c_16523 += Number(item.c_16523);
            this.ecData.devinfo.stat_c_16524 += Number(item.c_16524);
        }
        for (let item of this.ecData.ccbinfo.rows) {
            for (let i in this.barChartLabels) {
                if (item.c_15772 === this.barChartLabels[i]) {
                    this.barChartData[0].data[i] = item.c_15768;
                    this.barChartData[1].data[i] = item.c_15769;
                    this.barChartData[2].data[i] = item.c_15770;
                    this.barChartData[3].data[i] = item.c_15771;
                }
            }
        }
        for (let item of this.ecData.teaminfo.rows) {
            for (let i in this.barTeamChartLabels) {
                if (item.c_12879 === this.barTeamChartLabels[i]) {
                    for (let j in this.barTeamChartData) {
                        if (item.c_15612 === this.barTeamChartData[j]. label) {
                            this.barTeamChartData[j].data[i] = item.c_12897;
                        }
                    }
                }
            }
        }
        this.ecData.expireinfo.rows = this.ecData.expireinfo.rows.sort(
            (x, y) => y.c_16530 - x.c_16530
        );
    }

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

    //CCB
	public barChartLabels: string[] = ['待技术审核', '待审核', '待验证', '已延期', '已验证延期'];

	public barChartData: any[] = [
		{data: [0, 0, 0, 0, 0], label: '待CCB处理变更请求数'},
		{data: [0, 0, 0, 0, 0], label: '待CCB处理变更活动数'},
		{data: [0, 0, 0, 0, 0], label: '待CCB处理变更请求数（已超期）'},
		{data: [0, 0, 0, 0, 0], label: '待CCB处理变更活动数（已超期）'},
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

    // 团队EC
    public barTeamChartLabels: string[] = [
        'vManager SE', 
        'vManager ST组', 
        'vManager UI', 
        'vManager-凌云团队', 
        'vManager-圣甲虫团队',
        'vManager-喜洋洋团队',
        'vManager-云间团队',
        'vManager-争鸣团队',
        '蓝图工具',
    ];

	public barTeamChartData: any[] = [
		{data: [0, 0, 0, 0, 0, 0, 0, 0, 0], label: '待处理'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0, 0], label: '待提交研究结果'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0, 0], label: '待入受控库'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0, 0], label: '待开发验证'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0, 0], label: '待文档入库'},
	];

	public barTeamChartColors:Array<any> = [
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
		{
			backgroundColor: 'gray',
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
