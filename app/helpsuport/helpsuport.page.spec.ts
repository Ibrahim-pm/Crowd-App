import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpsuportPage } from './helpsuport.page';

describe('HelpsuportPage', () => {
  let component: HelpsuportPage;
  let fixture: ComponentFixture<HelpsuportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpsuportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpsuportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
