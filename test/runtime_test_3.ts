import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AnalyzeService } from './analyze.service';

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss']
})
export class AnalyzeComponent implements OnInit {

  analyzeResult: AnalyzeResult | any = {};

  analyzeTotal: number = 0;
  analyzePassed: number = 0;

  calculated: number = 0.0;
  potential: number = 0.0;

  timePassed: string = '';

  codeQualityRules: Rule[] = [];
  codeQualityErrors: Error[] = [];
  codeQualityTotal: number = 0;
  codeQualityPassed: number = 0;

  codeStandardRules: Rule[] = [];
  codeStandardErrors: Error[] = [];
  codeStandardTotal: number = 0;
  codeStandardPassed: number = 0;

  analyzeResultChartData: any;
  analyzeResultChartCategories: any;

  analyzeResultGaugeData: any;

  constructor(private analyseService: AnalyzeService, private dashboardService: DashboardService) {
    this.analyzeResultChartData = this.dashboardService.getColumnDummyData();
    this.analyzeResultGaugeData = [0];
   }

  ngOnInit(): void {
    this.analyzeFile();
  }

  analyzeFile(): any {
    this.analyseService.analyzeFile().subscribe(response => {
      this.analyzeResult = response;

      this.analyzeTotal = this.analyzeResult['total'];
      this.analyzePassed = this.analyzeResult['passed'];
      
      this.timePassed = this.analyzeResult['time'];
      this.calculated = this.analyzeResult['index'];
      this.potential = this.analyzeResult['potential'];

      this.codeQualityRules = this.getCodeQualityRules();
      this.codeQualityErrors = this.getCodeQualityErrors();
      this.codeQualityTotal = this.getCodeQualityTotal();
      this.codeQualityPassed = this.getCodeQualityPassed();

      this.codeStandardRules = this.getCodeStandardRules();
      this.codeStandardErrors = this.getCodeStandardErrors();
      this.codeStandardTotal = this.getCodeStandardTotal();
      this.codeStandardPassed = this.getCodeStandardPassed();

      this.analyzeResultChartData = this.getAnalyzeResultChartData();
      console.log('analyzeResultChartData:' + JSON.stringify(this.analyzeResultChartData));
      this.analyzeResultChartCategories = this.getAnalyzeResultChartCategories();
      console.log('analyzeResultChartCategories:' + JSON.stringify(this.analyzeResultChartCategories));

      this.analyzeResultGaugeData = this.getAnalyzeResultGaugeData();

    });
  }

  getCodeQualityRules() {
    return this.analyzeResult['details'].filter((rule: Rule) => rule.category == 'Code Quality');
  }

  getCodeQualityErrors() {
    var result: Error[] = [];
    this.codeQualityRules.forEach(function (value) {
      result = result.concat(value.errors);
    });
    return result;
  }

  getCodeQualityTotal() {
    var result: number = 0;
    this.codeQualityRules.forEach(function (value) {
      result += value.total;
    });
    return result;
  }

  getCodeQualityPassed() {
    var result: number = 0;
    this.codeQualityRules.forEach(function (value) {
      result += value.passed;
    });
    return result;
  }

  getCodeStandardRules() {
    return this.analyzeResult['details'].filter((rule: Rule) => rule.category == 'Code Standards');
  }

  getCodeStandardErrors() {
    var result: Error[] = [];
    this.codeStandardRules.forEach(function (value) {
      result = result.concat(value.errors);
    });
    return result;
  }

  getCodeStandardTotal() {
    var result: number = 0;
    this.codeStandardRules.forEach(function (value) {
      result += value.total;
    });
    return result;
  }

  getCodeStandardPassed() {
    var result: number = 0;
    this.codeStandardRules.forEach(function (value) {
      result += value.passed;
    });
    return result;
  }

  getAnalyzeResultChartData() {
    return [{
      name: 'Total',
      data: [this.analyzeResult['total']]
    }, {
      name: 'Passed',
      data: [this.analyzeResult['passed']]
    }, {
      name: 'Error',
      data: [(this.analyzeResult['total'] - this.analyzeResult['passed'])]
    }];
  }

  getAnalyzeResultChartCategories() {
    return [
      this.analyzeResult['file']
    ];
  }

  getAnalyzeResultGaugeData() {
    return [(this.calculated / this.potential) * 100];
  }
}

export interface AnalyzeResult {
  file: string;
  total: number;
  passed: number;
  status: string;
  details: Rule[];
}

export interface Rule {
  category: string;
  rule: string;
  total: number;
  passed: number;
  status: string;
  errors: Error[];
}

export interface Error {
  name: string,
  start: number,
  end: number,
  message: string;
}