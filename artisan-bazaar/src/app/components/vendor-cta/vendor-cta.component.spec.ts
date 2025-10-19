import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCtaComponent } from './vendor-cta.component';

describe('VendorCtaComponent', () => {
  let component: VendorCtaComponent;
  let fixture: ComponentFixture<VendorCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
