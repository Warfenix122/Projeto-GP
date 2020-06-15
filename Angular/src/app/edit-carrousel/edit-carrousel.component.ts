import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileService } from '../services/file.service'
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-edit-carrousel',
  templateUrl: './edit-carrousel.component.html',
  styleUrls: ['./edit-carrousel.component.css']
})
export class EditCarrouselComponent implements OnInit {
  file: any;
  images: HTMLElement;
  constructor(private fileService: FileService, private _alertService: AlertService) { }

  ngOnInit(): void {
    this.images = document.getElementById('images')
    this.getAllCarrouselPhotos();

  }

  getAllCarrouselPhotos() {
    this.images.innerHTML = "";
    this.fileService.getAllCarrouselPhotos().subscribe((res) => {
      for (const f of res['fotos']) {
        const photo = f.foto
        const id  = f._id;
        console.log('id :>> ', id);
        const src = this.arrayBufferToBase64(photo.data.data);
        const div = document.createElement('div');
        div.style.width = "200px";
        div.style.height = "200px";
        div.className = "card";
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-trash-alt"></i> Eliminar'
        btn.className = "card-text btn btn-danger";
        btn.onclick = () => { this.onDelete(id) }
        const img = <HTMLImageElement>document.createElement('img');
        img.src = 'data:' + photo.contentType + ';base64,' + src;
        img.className = "card-img-top"
        img.width = 200;
        img.height = 200;
        div.appendChild(img)
        div.appendChild(btn);


        this.images.appendChild(div);
      }

    }, (err) => {
      this._alertService.error("Impossivel apagar foto!");
    });
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

  onFileChanged(event) {
    this.file = event.target.files[0];
  }

  private onDelete(src) {
    this.fileService.deleteCarrouselPhoto({ 'src': src }).subscribe((res) => {
      this._alertService.success("Foto Apagada");
      this.getAllCarrouselPhotos()
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
      this.fileService.uploadCarrouselPhoto(formData).subscribe((res) => {
        this._alertService.success("Foto Atualizada");
        this.getAllCarrouselPhotos()
      }, (err) => {
        this._alertService.error("Impossivel atualizar a foto, tente utilizar outra foto!");
      });
    };
    reader.readAsDataURL(this.file);

  }
}
