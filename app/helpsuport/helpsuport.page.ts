import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-helpsuport',
  templateUrl: './helpsuport.page.html',
  styleUrls: ['./helpsuport.page.scss'],
})
export class HelpsuportPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
	this.location.back();
  }

}
