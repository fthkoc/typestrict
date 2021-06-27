import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import ChartModuleMore from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HCSoldGauge from 'highcharts/modules/solid-gauge';

@Component({
  selector: 'app-widget-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts
  chartOptions: any = {};
  updateFlag = false;

  @Input() text: string = '';
  @Input() data: any = [];

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'solidgauge'
      },

      title: 'Calculated Success Index',

      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },

      exporting: {
        enabled: false
      },

      tooltip: {
        enabled: false
      },

      // the value axis
      yAxis: {
        stops: [
          [0.1, '#DF5353'], // red
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#55BF3B'] // green
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16
        },
        min: 0,
        max: 100,
        title: {
          text: 'Success Index Percentage',
          y: 130
        }
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      },

      credits: {
        enabled: false
      },

      series: this.data
    };

    ChartModuleMore(Highcharts);
    HCSoldGauge(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
      this.handleUpdate()
      console.log('updated');
    }, 500);
  }

  handleUpdate() {
    console.log(this.chartOptions.series);
    this.chartOptions.series = {
      data: this.data
    }
    this.updateFlag = true;
  }
}
