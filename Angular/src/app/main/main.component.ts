import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { AlertService } from '../services/alert.service';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  fotos: Array<any>;
  constructor(private fotoService: FotoService) { }


  ngOnInit(): void {
    this.getAllCarrouselPhotos();
  }

  getAllCarrouselPhotos() {
    this.fotoService.getAllDecodedCarouselFotos().then((fotos) => {
      this.fotos = fotos;
    });
  }

  getSrc(fotoId) {
    const foto = this.fotos.find(elem => elem.id == fotoId);
    if (foto) {
      return 'data:' + foto.contentType + ';base64,' + foto.src;
    }
    else {
      return "https://higuma.github.io/bootstrap-4-tutorial/img/286x180.svg";
    }
  }


}

