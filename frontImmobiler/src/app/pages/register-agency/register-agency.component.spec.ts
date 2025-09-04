import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAgencyComponent } from './register-agency.component';

describe('RegisterAgencyComponent', () => {
  let component: RegisterAgencyComponent;
  let fixture: ComponentFixture<RegisterAgencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterAgencyComponent]
    });
    fixture = TestBed.createComponent(RegisterAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
