import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  title: string = 'title';
  SUBTITLE: string = 'subtitle';

  constructor() { }

  /**
   * 
   * @param left 
   * @param right 
   * @returns number 
   */
  sum(left: number, right: number): number {
    return left + right;
  }


  printToConsole(message, MESSAGE_CONSTANT) {
    var debug = 'DEBUG';
    var SEPERATOR = '::';
    const debug-constant = 'DEBUG';
    const SEPERATOR_CONSTANT = '::';
    var methodName = 'printToConsole';
    console.log(debug + SEPERATOR + methodName + SEPERATOR + message);
  }

}
