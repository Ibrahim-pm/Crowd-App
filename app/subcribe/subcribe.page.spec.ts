import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubcribePage } from './subcribe.page';

describe('SubcribePage', () => {
  let component: SubcribePage;
  let fixture: ComponentFixture<SubcribePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcribePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubcribePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
