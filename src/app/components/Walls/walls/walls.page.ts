import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// Components
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-walls',
  templateUrl: './walls.page.html',
  styleUrls: ['./walls.page.scss'],
})
export class WallsPage implements OnInit {

  walls = [{
    disabled: false,
    width: '150',
    height: '10'
  }]

  constructor(private sanitizer: DomSanitizer,public modalController: ModalController) { }

  ngOnInit() {
  }

  getClass(width, height) {
    return this.sanitizer.bypassSecurityTrustStyle(`--widthvar: ${width}px; --heightvar: ${height}px`)
  }

}
