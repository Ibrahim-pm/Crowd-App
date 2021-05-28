import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankformPage } from './bankform.page';

describe('BankformPage', () => {
  let component: BankformPage;
  let fixture: ComponentFixture<BankformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankformPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
