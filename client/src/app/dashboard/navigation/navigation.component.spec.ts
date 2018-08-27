import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: DashboardNavigationComponent;
  let fixture: ComponentFixture<DashboardNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardNavigationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
