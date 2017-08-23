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
        // this.ecService.httpObservable.subscribe(
        //     data => this.refresh(data),
        //     error => console.log(error),
        //     () => console.log('complete')
        // );

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
        for (let item of this.ecData.ccbinfo) {
            for (let i in this.barCCBChartLabels) {
                if (item['状态'] === this.barCCBChartLabels[i]) {
                    this.barCCBChartData[0].data[i] = item['待CCB处理变更请求数']
                    this.barCCBChartData[1].data[i] = item['待CCB处理变更活动数'];
                    this.barCCBChartData[2].data[i] = item['待CCB处理变更请求（已超期）'];
                    this.barCCBChartData[3].data[i] = item['待CCB处理变更活动数（已超期）'];
                }
            }
        }
        for (let item of this.ecData.teaminfo) {
            for (let i in this.barTeamChartLabelsMatch) {
                if (item['特性团队'] === this.barTeamChartLabelsMatch[i]) {
                    for (let j in this.barTeamChartData) {
                        if (item['状态'] === this.barTeamChartData[j].label) {
                            let a = Number(item['待处理的变更活动单']);
                            let b = Number(item['待处理的变更研究单']);
                            this.barTeamChartData[j].data[i] = a===a ? a : b;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        this.ecData.devinfo = this.ecData.devinfo.sort(
            (x, y) => y['待处理总数'] - x['待处理总数']
        );
        this.ecData.devinfo.forEach(x => {
            if (x['待处理的变更研究单'] === 'None') {
                x['待处理的变更研究单'] = '';
            }
            if (x['待处理的变更活动单'] === 'None') {
                x['待处理的变更活动单'] = '';
            }
        });
    }

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

    //CCB
	public barCCBChartLabels: string[] = ['待技术审核', '待批准', '待审核', '待指派验证', '待验证', '待指派验证', '已延期', '已验证延期'];

	public barCCBChartData: any[] = [
		{data: [0, 0, 0, 0, 0, 0, 0, 0], label: '待CCB处理变更请求数'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0], label: '待CCB处理变更活动数'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0], label: '待CCB处理变更请求数（已超期）'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0], label: '待CCB处理变更活动数（已超期）'},
	];

	public barCCBChartColors:Array<any> = [
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
    public barTeamChartLabelsMatch: string[] = [
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

    public barTeamChartLabels: string[] = [
        'SE',
        'ST组',
        'UI',
        '凌云团队',
        '圣甲虫团队',
        '喜洋洋团队',
        '云间团队',
        '争鸣团队',
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
