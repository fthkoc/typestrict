import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  
  isSidebarOpened = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
  }

}
