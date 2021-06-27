import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { AnalyzeGitHubComponent } from './modules/analyze-git-hub/analyze-git-hub.component';
import { AnalyzeComponent } from './modules/analyze/analyze.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SettingsComponent } from './modules/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'analyze',
        component: AnalyzeComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'analyzeGitHub',
        component: AnalyzeGitHubComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
