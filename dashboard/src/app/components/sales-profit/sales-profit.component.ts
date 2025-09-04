import { Component, ViewChild, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ApexAxisChartSeries,
    ApexPlotOptions,
    NgApexchartsModule,
    ApexFill,
    ApexGrid,
    ApexXAxis,
    ApexYAxis,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { VisitePlateformService } from 'src/app/services/visite-plateform.service';

export interface SalesProfitChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    fill: ApexFill;
    grid: ApexGrid;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
}

interface Month {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-sales-profit',
    imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, MatButtonModule, CommonModule],
    templateUrl: './sales-profit.component.html',
})
export class AppSalesProfitComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public salesprofitChart!: Partial<SalesProfitChart> | any;

    months: Month[] = [
        { value: 'week', viewValue: 'This Week' },
        { value: 'month', viewValue: 'This Month' },
        { value: 'year', viewValue: 'This Year' },
    ];

    totalVisits: number = 0;
    visitsLastWeek: number = 0;
    visitsThisWeek: number = 0;

    constructor(private visiteService: VisitePlateformService) {
        this.initChart(); // initialisation chart par défaut
    }

    ngOnInit(): void {
        // récupération des stats de visite
        this.visiteService.getAllStats().subscribe({
            next: (res) => {
                this.totalVisits = res.total_visites;
                this.visitsLastWeek = res.visites_last_week;
                this.visitsThisWeek = res.nombre_visites_semaine;

                // mise à jour du chart avec les données dynamiques
                this.salesprofitChart.series = [
                    {
                        name: "Total Visits",
                        type: "area",
                        data: [
                            { x: "Total", y: this.totalVisits },
                            { x: "Last Week", y: this.visitsLastWeek },
                            { x: "This Week", y: this.visitsThisWeek },
                        ]
                    }
                ];

                // forcer le chart à se mettre à jour
                if (this.chart) {
                    this.chart.updateSeries(this.salesprofitChart.series);
                }
            },
            error: (err) => console.error('Erreur récupération stats', err)
        });
    }

    initChart(): void {
        this.salesprofitChart = {
            series: [
                {
                    name: "Total Visits",
                    type: "area",
                    data: [
                        { x: "Total", y: 0 },
                        { x: "Last Week", y: 0 },
                        { x: "This Week", y: 0 },
                    ]
                }
            ],
            chart: {
                height: 320,
                type: 'area',
                fontFamily: "inherit",
                foreColor: "#adb0bb",
                fontSize: "12px",
                animations: { speed: 500 },
                toolbar: { show: false },
            },
            colors: ["#00A1FF"],
            dataLabels: { enabled: false },
            fill: { opacity: 0.1, type: 'solid' },
            grid: { show: true, strokeDashArray: 3, borderColor: "#90A4AE50" },
            stroke: { curve: "smooth", width: 2 },
            xaxis: { type: 'category', axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { tickAmount: 3 },
            legend: { show: false },
            tooltip: { theme: "dark" },
        };
    }
}
