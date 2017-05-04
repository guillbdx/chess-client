import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  deployed = false;

  toggleNavContent() {
    this.deployed = ! this.deployed;
  }

}
