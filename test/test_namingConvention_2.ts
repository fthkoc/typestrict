import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  Title: string = 'title';
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


  printToConsole(Message, MESSAGE_CONSTANT) {
    var Debug = 'DEBUG';
    var SEPERATOR = '::';
    const DebugConstant = 'DEBUG';
    const SEPERATOR_CONSTANT = '::';
    var methodName = 'printToConsole';
    console.log(Debug + SEPERATOR + methodName + SEPERATOR + Message);
  }

}
