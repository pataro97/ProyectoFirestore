import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainloginPage } from './mainlogin.page';

describe('MainloginPage', () => {
  let component: MainloginPage;
  let fixture: ComponentFixture<MainloginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainloginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
