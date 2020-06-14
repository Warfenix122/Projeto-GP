import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }


  uploadCarrouselPhoto(formData) {
    return this.http.post('/api/uploadCarrouselPhoto', formData, {
      observe: 'body',
      withCredentials: true
    });
  }

  deleteCarrouselPhoto(formdata) {
    return this.http.post('/api/deleteCarrouselPhoto', formdata, {
      observe: 'body',
      withCredentials: true
    });
  }

  getAllCarrouselPhotos() {
    return this.http.post('/api/getAllCarrouselPhotos', {
      observe: 'body',
      withCredentials: true,

    });
  }


}
