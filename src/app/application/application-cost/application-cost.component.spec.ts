import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCostComponent } from './application-cost.component';

describe('ApplicationCostComponent', () => {
  let component: ApplicationCostComponent;
  let fixture: ComponentFixture<ApplicationCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
