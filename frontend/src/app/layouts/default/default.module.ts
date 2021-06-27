import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AnalyzeComponent } from 'src/app/modules/analyze/analyze.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from 'src/app/modules/dashboard/dashboard.service';
import { AnalyzeService } from 'src/app/modules/analyze/analyze.service';
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { SettingsComponent } from 'src/app/modules/settings/settings.component';
import { SettingsService } from 'src/app/modules/settings/settings.service';
import { AnalyzeGitHubComponent } from 'src/app/modules/analyze-git-hub/analyze-git-hub.component';


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    AnalyzeComponent,
    SettingsComponent,
    AnalyzeGitHubComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [
    DashboardService,
    AnalyzeService,
    SettingsService
  ]
})
export class DefaultModule { }
