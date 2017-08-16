import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiComponent } from './ci.component';

describe('CiComponent', () => {
  let component: CiComponent;
  let fixture: ComponentFixture<CiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
