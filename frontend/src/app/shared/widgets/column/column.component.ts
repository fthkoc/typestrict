import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-widget-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts
  chartOptions: any = {};

  @Input() text: string = '';
  @Input() data: any = [];
  @Input() categories: any = [];
  @Input() update: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: this.text,
      },
      subtitle: {
        text: 'Source: typestrict backend'
      },
      xAxis: {
        categories: this.categories,
        crosshair: true,
        startOnTick: false,
        endOnTick: false,
        tickOptions: []
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count'
        }
      },
      exporting: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      series: this.data
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
      this.handleUpdate()
      console.log('column chart updated');
    }, 200);
  }

  handleUpdate() {
    this.chartOptions.xAxis = {
      categories: this.categories,
    },
    console.log('before update:');
    console.log(this.chartOptions.series);
    this.chartOptions.series = this.data;
    console.log('after update:');
    console.log(this.chartOptions.series);
    this.update = true;
  }
}
