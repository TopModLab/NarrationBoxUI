import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadXMLComponent } from './download-xml.component';

describe('DownloadXMLComponent', () => {
  let component: DownloadXMLComponent;
  let fixture: ComponentFixture<DownloadXMLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadXMLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadXMLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
