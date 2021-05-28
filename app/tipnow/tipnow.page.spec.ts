import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TipnowPage } from './tipnow.page';

describe('TipnowPage', () => {
  let component: TipnowPage;
  let fixture: ComponentFixture<TipnowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipnowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TipnowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
