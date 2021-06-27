import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../analyze/analyze.service';

@Component({
  selector: 'app-analyze-git-hub',
  templateUrl: './analyze-git-hub.component.html',
  styleUrls: ['./analyze-git-hub.component.scss']
})
export class AnalyzeGitHubComponent implements OnInit {
  gitHubURL: string = '';

  analyzeResult: AnalyzeResult | any = {};

  analyzeTotal: number = 0;
  analyzePassed: number = 0;
  analyzeError: number = 0;

  calculated: number = 0.0;
  potential: number = 0.0;

  timePassed: string = '';

  parsingRules: Rule[] = [];
  parsingErrors: Error[] = [];
  parsingTotal: number = 0;
  parsingPassed: number = 0;

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
  analyzeResultChartUpdateFlag: boolean = false;

  analyzeResultGaugeData: any;

  constructor(private analyseService: AnalyzeService) { }

  ngOnInit(): void {
    this.analyzeResultChartData = this.getAnalyzeResultChartData();
    this.analyzeResultGaugeData = this.getAnalyzeResultGaugeData();
    this.analyzeResultChartCategories = this.getAnalyzeResultChartCategories();
    this.analyzeResultChartUpdateFlag = true;
  }

  getURL(url: any) {
    this.gitHubURL = JSON.stringify(url);
    this.analyzeFileFromGitHub(this.gitHubURL);
  }

  analyzeFileFromGitHub(url: string): any {
    this.analyseService.analyzeFileFromGitHub(url).subscribe(response => {
      this.analyzeResult = response;

      this.analyzeTotal = this.analyzeResult['total'];
      this.analyzePassed = this.analyzeResult['passed'];
      this.analyzeError = this.analyzeTotal - this.analyzePassed;

      this.timePassed = this.analyzeResult['time'];
      this.calculated = this.analyzeResult['index'];
      this.potential = this.analyzeResult['potential'];

      //this.parsingRules = this.analyzeResult['status'];
      //this.parsingErrors = this.getParsingErrors();
      //this.parsingTotal = this.getParsingTotal();
      //this.parsingPassed = this.getParsingPassed();

      this.codeQualityRules = this.getCodeQualityRules();
      this.codeQualityErrors = this.getCodeQualityErrors();
      this.codeQualityTotal = this.getCodeQualityTotal();
      this.codeQualityPassed = this.getCodeQualityPassed();

      this.codeStandardRules = this.getCodeStandardRules();
      this.codeStandardErrors = this.getCodeStandardErrors();
      this.codeStandardTotal = this.getCodeStandardTotal();
      this.codeStandardPassed = this.getCodeStandardPassed();

      this.analyzeResultChartData = this.getAnalyzeResultChartData();
      this.analyzeResultChartCategories = this.getAnalyzeResultChartCategories();
      this.analyzeResultChartUpdateFlag = true;

      this.analyzeResultGaugeData = this.getAnalyzeResultGaugeData();
    });
  }

  getParsingRules() {
    return this.analyzeResult['details'].filter((rule: Rule) => rule.category == 'Parse Errors');
  }

  getParsingErrors() {
    var result: Error[] = [];
    this.parsingRules.forEach(function (value) {
      result = result.concat(value.errors);
    });
    return result;
  }

  getParsingTotal() {
    var result: number = 0;
    this.parsingRules.forEach(function (value) {
      result += value.total;
    });
    return result;
  }

  getParsingPassed() {
    var result: number = 0;
    this.parsingRules.forEach(function (value) {
      result += value.passed;
    });
    return result;
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
      data: [this.analyzeTotal]
    }, {
      name: 'Passed',
      data: [this.analyzePassed]
    }, {
      name: 'Error',
      data: [this.analyzeError]
    }, {
      name: 'Code Quality Index',
      data: [this.calculated]
    }, {
      name: 'Potential Index',
      data: [this.potential]
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
