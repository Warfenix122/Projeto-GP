import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileService } from '../services/file.service'
import { AlertService } from '../services/alert.service';
import { FotoService } from '../services/foto.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-carrousel',
  templateUrl: './edit-carrousel.component.html',
  styleUrls: ['./edit-carrousel.component.css']
})
export class EditCarrouselComponent implements OnInit {
  file: any;
  fotos: Array<any> = [];

  addPhotoResult: any;
  selectedPhotoFileName: string;

  constructor(private router: Router, private _authService: AuthService,private fileService: FileService, private fotoService: FotoService, private _alertService: AlertService) { }

  ngOnInit(): void {
    if (this._authService.isLoggedIn()) {
      this._authService.getRole().subscribe(res => {
        if (res["Role"] !== "Gestor") {
          this.router.navigate(['unauthorized']);
        }
      });
      this.getAllCarrouselPhotos();

    }else{
      this.router.navigate(['unauthorized']);

    }
  }

  getAllCarrouselPhotos() {
    this.fotoService.getAllDecodedCarouselFotos().then((fotos) => {
      this.fotos = fotos;
    });
  }

  getSrc(foto) {
    if (foto) {
      return 'data:' + foto.contentType + ';base64,' + foto.src;
    }
    else {
      return "https://higuma.github.io/bootstrap-4-tutorial/img/286x180.svg";
    }
  }


  onDelete(id) {
    this.fileService.deletePhoto(id).subscribe((res) => {
      this._alertService.success("Foto Apagada");
      this.getAllCarrouselPhotos();
    }, (err) => {
      this._alertService.error("Impossivel atualizar a foto, tente utilizar outra foto!");
    });
  }



  onFileSelected(event) {
    const files = event.target.files;

    if (files.length > 0) {
      this.selectedPhotoFileName = files[0].name;

    }
    const file = files[0];

    const inputNode: any = document.querySelector('#fileCarousel');

    const formdata = new FormData();
    formdata.append('file', file, file.name);

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.addPhotoResult = e.target.result;
      };
      reader.onloadend = () => {
        this.fileService.updateCarouselPhoto(formdata).subscribe(res => {
          let fotoId = [];
          if(res["fotoId"] != undefined){
            let index = this.fotos.push(undefined) - 1;
            fotoId.push(res["fotoId"]);
            this.fotoService.getDecodedFotos(fotoId, 'carousel').then(result => {
              this.fotos[index] = result[0];
            })
          }
        });
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }



}
