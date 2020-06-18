import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileService } from '../services/file.service'
import { AlertService } from '../services/alert.service';
import { FotoService } from '../services/foto.service';
@Component({
  selector: 'app-edit-carrousel',
  templateUrl: './edit-carrousel.component.html',
  styleUrls: ['./edit-carrousel.component.css']
})
export class EditCarrouselComponent implements OnInit {
  file: any;
  fotos: Array<any> = [];
  constructor(private fileService: FileService, private fotoService: FotoService, private _alertService: AlertService) { }

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


  onFileChanged(event) {
    this.file = event.target.files[0];
  }

  onDelete(id) {
    this.fileService.deletePhoto(id).subscribe((res) => {
      this._alertService.success("Foto Apagada");
      this.getAllCarrouselPhotos();
    }, (err) => {
      this._alertService.error("Impossivel atualizar a foto, tente utilizar outra foto!");
    });
  }

  onUpload() {
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result;
      formData.append('type', 'carousel');
      this.fileService.uploadPhoto(formData).subscribe((res) => {
        this.getAllCarrouselPhotos();
      });
    };
    reader.readAsDataURL(this.file);

  }
}
