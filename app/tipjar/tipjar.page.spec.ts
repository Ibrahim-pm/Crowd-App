import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TipjarPage } from './tipjar.page';

describe('TipjarPage', () => {
  let component: TipjarPage;
  let fixture: ComponentFixture<TipjarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipjarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TipjarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
