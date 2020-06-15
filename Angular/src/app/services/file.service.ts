import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  uploadPhoto(formData) {
    return this.http.post('/api/file/uploadProfilePhoto', formData, {
      observe: 'body',
      withCredentials: true
    });
  }
  getProfilePhoto(formData) {
    return this.http.post('/api/file/getProfilePhoto', formData, {
      observe: 'body',
      withCredentials: true,

    });
  }
  uploadCarrouselPhoto(formData) {
    return this.http.post('/api/file/uploadCarrouselPhoto', formData, {
      observe: 'body',
      withCredentials: true
    });
  }

  deleteCarrouselPhoto(formdata) {
    return this.http.post('/api/file/deleteCarrouselPhoto', formdata, {
      observe: 'body',
      withCredentials: true
    });
  }

  getAllCarrouselPhotos() {
    return this.http.post('/api/file/getAllCarrouselPhotos', {
      observe: 'body',
      withCredentials: true,

    });
  }


}
