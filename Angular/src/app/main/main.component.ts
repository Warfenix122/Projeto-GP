import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  file: any;
  carouselInner: HTMLElement;
  constructor(private fileService: FileService, private _alertService: AlertService) { }

  ngOnInit(): void {
    this.carouselInner = document.getElementById('carousel-inner')
    this.getAllCarrouselPhotos()
  }
  getAllCarrouselPhotos() {
    this.fileService.getAllCarrouselPhotos().subscribe((res) => {
      for (const f of res['fotos']) {

        const photo = f.foto;
        let src = this.arrayBufferToBase64(photo.data.data);
        const div = <HTMLDivElement>document.createElement('div');
        div.className = "carousel-item"

        const img = <HTMLImageElement>document.createElement('img');
        img.src = 'data:' + photo.contentType + ';base64,' + src;
        img.width = 200;
        img.height = 200;
        img.className = "d-block w-100"
        div.appendChild(img);
        this.carouselInner.appendChild(div)

      }

    }, (err) => {
      this._alertService.error("Impossivel atualizar a foto, tente utilizar outra foto!");
    });
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

}

