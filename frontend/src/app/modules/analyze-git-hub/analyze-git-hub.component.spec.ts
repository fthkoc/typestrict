import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeGitHubComponent } from './analyze-git-hub.component';

describe('AnalyzeGitHubComponent', () => {
  let component: AnalyzeGitHubComponent;
  let fixture: ComponentFixture<AnalyzeGitHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyzeGitHubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeGitHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
