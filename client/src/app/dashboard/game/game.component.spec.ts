import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGameComponent } from './game.component';

describe('DashboardGameComponent', () => {
  let component: DashboardGameComponent;
  let fixture: ComponentFixture<DashboardGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardGameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
