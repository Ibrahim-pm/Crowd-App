import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CountrycodePage } from './countrycode.page';

describe('CountrycodePage', () => {
  let component: CountrycodePage;
  let fixture: ComponentFixture<CountrycodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrycodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CountrycodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
