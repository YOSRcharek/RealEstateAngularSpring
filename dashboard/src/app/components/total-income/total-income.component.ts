import { Component, ViewChild, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
    ApexChart,
    ChartComponent,
    ApexAxisChartSeries,
    ApexStroke,
    ApexTooltip,
    ApexFill,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AnnonceService } from 'src/app/services/annonce.service';
import { VisitePlateformService } from 'src/app/services/visite-plateform.service';
export interface TotalAnnonceChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    stroke: ApexStroke;
    fill: ApexFill;
    tooltip: ApexTooltip;
}

@Component({
    selector: 'app-total-income',
    standalone: true,
    imports: [MaterialModule, NgApexchartsModule, MatButtonModule, TablerIconsModule, CommonModule],
    templateUrl: './total-income.component.html',
})
export class AppTotalIncomeComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public totalAnnonceChart!: Partial<TotalAnnonceChart> | any;

    totalAnnonces: number = 0;
    annoncesLastWeek: number = 0;

      constructor(private visitService: VisitePlateformService) {
        this.initChart(); // initialisation chart par défaut
    }

    ngOnInit(): void {
        // récupération des stats des annonces
        this.visitService.getAllStats().subscribe({
            next: (res) => {
                this.totalAnnonces = res.total_annonces;
                this.annoncesLastWeek = res.annonces_last_week;

                // mise à jour du chart
                this.totalAnnonceChart.series = [
                    {
                        name: "Annonces",
                        data: [this.totalAnnonces, this.annoncesLastWeek],
                    },
                ];

                if (this.chart) {
                    this.chart.updateSeries(this.totalAnnonceChart.series);
                }
            },
            error: (err) => console.error('Erreur récupération stats', err),
        });
    }

    initChart(): void {
        this.totalAnnonceChart = {
            chart: {
                id: "total-annonce",
                type: "area",
                height: 75,
                sparkline: { enabled: true },
                fontFamily: "inherit",
                foreColor: "#adb0bb",
            },
            series: [
                { name: "Annonces", data: [0, 0] }
            ],
            stroke: { curve: "smooth", width: 2 },
            fill: {
                type: "gradient",
                gradient: { shadeIntensity: 0, opacityFrom: 0, opacityTo: 0, stops: [20, 180] }
            },
            tooltip: {
                theme: "dark",
                fixed: { enabled: true, position: "right" },
                x: { show: false },
            },
        };
    }
}
