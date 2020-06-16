import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from '../../../models/utilizadores';
import { Project } from 'models/projeto';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private userService: UserService) { }

  updateProfilePhoto(formdata) {
    formdata.append('type', 'users')
    this.userService.getCurrentUserId().subscribe((userId) => {
      this.uploadPhoto(formdata).subscribe((res) => {
        this.updateUserPhoto(res['fotoId'], userId['UserID']).subscribe((res) => {
          // do evento
        });
      });
    });
  }

  updateCoverPhoto(formdata) {
    formdata.append('type', 'projects')
    this.uploadPhoto(formdata).subscribe((res) => {
      this.updateProjectPhoto(res['foto'], formdata).subscribe((res) => { })

    });

  }

  uploadCarouselPhoto(formdata) {
    formdata.append('type', 'carousel')
    this.uploadPhoto(formdata).subscribe((res) => {
    });
  }

  updateUserPhoto(fotoId, userId) {
    return this.http.put<User>('/api/file/updateUserPhoto/' + userId, { 'fotoId': fotoId });
  }

  updateProjectPhoto(fotoId, projectId) {
    return this.http.put<Project>('/api/file/updateProjectPhoto/' + projectId, { 'fotoId': fotoId });
  }


  uploadPhoto(formData) {
    return this.http.post('/api/file/uploadPhoto', formData, {
      observe: 'body',
      withCredentials: true
    });
  }

  deletePhoto(fotoId) {
    return this.http.delete('/api/file/deletePhoto/' + fotoId);
  }

}
