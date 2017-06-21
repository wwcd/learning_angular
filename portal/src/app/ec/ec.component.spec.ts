import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcComponent } from './ec.component';

describe('EcComponent', () => {
  let component: EcComponent;
  let fixture: ComponentFixture<EcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
