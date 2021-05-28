import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchtredingPage } from './searchtreding.page';

describe('SearchtredingPage', () => {
  let component: SearchtredingPage;
  let fixture: ComponentFixture<SearchtredingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchtredingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchtredingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
