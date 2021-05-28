import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComentPage } from './coment.page';

describe('ComentPage', () => {
  let component: ComentPage;
  let fixture: ComponentFixture<ComentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
