import { Component, OnInit } from '@angular/core';
import { Component, OnInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  title = 'title';
  subtitle: string = 'subtitle';

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


  printToConsole(message) {
    const debug = 'DEBUG';
    const SEPERATOR = '::';
    var methodName = 'printToConsole';
    console.log(debug + SEPERATOR + methodName + SEPERATOR + message);
  }

}

export class ExtraClass {
  title = 'title';
  subtitle: string = 'subtitle';

  constructor() { }
}
