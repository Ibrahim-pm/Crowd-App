import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BraintreePage } from './braintree.page';

describe('BraintreePage', () => {
  let component: BraintreePage;
  let fixture: ComponentFixture<BraintreePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BraintreePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BraintreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
