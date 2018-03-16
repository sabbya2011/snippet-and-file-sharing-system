import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateStorageComponent } from './private-storage.component';

describe('PrivateStorageComponent', () => {
  let component: PrivateStorageComponent;
  let fixture: ComponentFixture<PrivateStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
