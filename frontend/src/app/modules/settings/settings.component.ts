import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  config = {};
  updatedConfig = {};

  @ViewChild('configArea') textArea: any;

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.getConfig();
  }

  getConfig() {
    this.settingsService.getConfig().subscribe((data: Config) => 
      this.config = {
        fileFullPath: data.fileFullPath,
        resultPath: data.resultPath,
        rules: data.rules,
      }
    );
  }

  setConfig() {
    this.settingsService.setConfig(this.updatedConfig);
  }
}

export interface Config {
  fileFullPath: string;
  resultPath: string;
  rules: any;
}