import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  title: string = 'title';
  subtitle: string = 'subtitle';

  constructor() { }

  ngOnInit() {

  }
  
  sum(left: number, right: number): number {
    return left + right;
  }


  printToConsole(message) {
    const debug = 'DEBUG';
    const SEPERATOR = '::';
    var methodName = 'printToConsole';
    console.log(debug + SEPERATOR + methodName + SEPERATOR + message);
  }

}
