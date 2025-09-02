import { Component, ViewChild, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { VisitePlateformService } from 'src/app/services/visite-plateform.service';
export interface TotalFollowersChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string | any;
}

@Component({
  selector: 'app-total-followers',
  imports: [MaterialModule, NgApexchartsModule, MatButtonModule, TablerIconsModule],
  templateUrl: './total-followers.component.html',
})
export class AppTotalFollowersComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public totalfollowersChart!: Partial<TotalFollowersChart> | any;

  totalUsers: number = 0;
  totalSubscribers: number = 0;
  totalAgencies: number = 0;

  constructor(private visitService: VisitePlateformService) {
    this.initChart(); // Initialise le chart par défaut
  }

ngOnInit(): void {
  this.visitService.getAllStats().subscribe({
    next: (res) => {
      this.totalUsers = res.total_users;
      this.totalSubscribers = res.subscribers;
      this.totalAgencies = res.total_agences;

      // Mise à jour de la série
      this.totalfollowersChart.series = [
        { name: "Total Users", data: [this.totalUsers] },
        { name: "Subscribers", data: [this.totalSubscribers] },
      ];

      // Forcer le chart à se mettre à jour avec animation
      if (this.chart) {
        this.chart.updateSeries(this.totalfollowersChart.series);
      }
    },
    error: (err) => console.error('Erreur récupération stats', err),
  });
}

  initChart(): void {
    this.totalfollowersChart = {
      series: [
        { name: "Total Users", data: [0] },
        { name: "Subscribers", data: [0] },
      ],
      chart: {
        fontFamily: "inherit",
        type: "bar",
        height: 100,
        stacked: true,
        toolbar: { show: false },
        sparkline: { enabled: true },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 350 }
        }
      },
      grid: {
        show: false,
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 1,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      colors: ["#ff6692", "#e7d0d9"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          borderRadius: [3],
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "all",
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { show: false } },
      tooltip: { theme: "dark" },
      legend: { show: false },
    };
  }
}
