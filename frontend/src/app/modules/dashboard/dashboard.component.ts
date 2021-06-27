import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  cardDummyData: any = [];
  pieDummyData: any = [];

  dashboardData: any = {};

  dashboardResultChartData: any;
  dashboardResultChartCategories: any;
  dashboardResultChartUpdateFlag: boolean = false;

  averageQualityPercentage: any;
  cardQualityData: any;
  averageStandardsPercentage: any;
  cardStandardsData: any;

  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  constructor(private dashboardService: DashboardService) {
    this.dashboardResultChartData = this.dashboardService.getColumnDummyData();
    this.cardQualityData = this.dashboardService.getCardDummyData();
    this.averageQualityPercentage = this.cardQualityData.reduce((a: any, b: any) => a + b) / this.cardQualityData.length;
    this.cardStandardsData = this.dashboardService.getCardDummyData();
    this.averageStandardsPercentage = this.cardStandardsData.reduce((a: any, b: any) => a + b) / this.cardQualityData.length;
  }

  ngOnInit(): void {
    this.cardDummyData = this.dashboardService.getCardDummyData();
    // this.pieDummyData = this.dashboardService.getPieDummyData();
    // this.dataSource.paginator = this.paginator;

    this.dashboardService.getDashboardData().subscribe(response => {
      this.dashboardData = response;

      this.dashboardResultChartData = this.getResultChartData();
      this.dashboardResultChartCategories = this.getListOfFiles();
      this.dashboardResultChartUpdateFlag = true;
      
      this.averageQualityPercentage = this.getAverageQualityPercentage();
      this.cardQualityData = this.getCardQualityData();
      this.averageStandardsPercentage = this.getAverageStandardsPercentage();
      this.cardStandardsData = this.getCardStandardsData();
    });

  }

  getResultChartData() {
    var total: any[] = [];
    var passed: any[] = [];
    var error: any[] = [];
    var calculated: any[] = [];
    var potential: any[] = [];

    this.dashboardData.forEach((result: any) => {
      total.push([result['total']]);
      passed.push([result['passed']]);
      error.push([result['total'] - result['passed']]);
      calculated.push([result['index']]);
      potential.push([result['potential']]);
    });

    return [{
      name: 'Total',
      data: total
    }, {
      name: 'Passed',
      data: passed
    }, {
      name: 'Error',
      data: error
    }, {
      name: 'Code Quality Index',
      data: calculated
    }, {
      name: 'Potential Index',
      data: potential
    }];
  }

  getListOfFiles() {
    var fileNames: string[] = [];
    this.dashboardData.forEach((result: any) => {
      fileNames.push(result['file']);
    });
    return fileNames;
  }

  getAverageQualityPercentage() {
    var qualityData = this.getCardQualityData();
    return qualityData.reduce((a, b) => a + b) / qualityData.length;
  }

  getCardQualityData() {
    var cardQualityData: any[] = [];
    var averages: any[] = [];
    this.dashboardData.forEach((result: any) => {
      result['details'].filter((x: any) => x['category'] == "Code Quality").forEach((rule: any) => {
        averages.push(rule['passed'] / rule['total'] * 100);
      });
      cardQualityData.push(averages.reduce((a, b) => a + b) / averages.length);
    });
    return cardQualityData;
  }

  getAverageStandardsPercentage() {
    var standardsData = this.getCardQualityData();
    return standardsData.reduce((a, b) => a + b) / standardsData.length;
    
  }

  getCardStandardsData() {
    var cardStandardsData: any[] = [];
    var averages: any[] = [];
    this.dashboardData.forEach((result: any) => {
      result['details'].filter((x: any) => x['category'] == "Code Standards").forEach((rule: any) => {
        averages.push(rule['passed'] / rule['total'] * 100);
      });
      cardStandardsData.push(averages.reduce((a, b) => a + b) / averages.length);
    });
    return cardStandardsData;
  }
}

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
//   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
//   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
//   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
//   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
//   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
//   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
//   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
//   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
//   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
//   { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
//   { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
//   { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
//   { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
//   { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
//   { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
//   { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
//   { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
//   { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
//   { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
// ];
