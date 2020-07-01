import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from '../../../models/utilizadores';
import { Project } from 'models/projeto';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private userService: UserService, private projectService: ProjectService) { }

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
    formdata.append('type', 'projects');
    var projId = formdata.get('projectId');
    this.projectService.getProject(projId).subscribe((project) => {
      this.uploadPhoto(formdata).subscribe((res) => {
        this.updateProjectCover(res['fotoId'], project._id).subscribe((res) => { })
      });
    })


  }
  updateProjectPhotoFiles(formdata) {
    formdata.append('type', 'projects');
    var projId = formdata.get('projectId');
    this.projectService.getProject(projId).subscribe((project) => {
      this.uploadPhoto(formdata).subscribe((res) => {
        this.updateProjectPhotos(res['fotoId'], project._id).subscribe((res) => { })
      });
    })

  }
  updateCarouselPhoto(formdata) {
    formdata.append('type', 'carousel');
    this.uploadPhoto(formdata).subscribe((res) => {
    });
  }

  updateUserPhoto(fotoId, userId) {
    return this.http.put<User>('/api/file/updateUserPhoto/' + userId, { 'fotoId': fotoId });
  }

  updateProjectCover(fotoId, projectId) {
    return this.http.put<Project>('/api/file/updateProjectCover/' + projectId, { 'fotoId': fotoId });
  }

  updateProjectPhotos(fotoId, projectId) {
    return this.http.put<Project>('/api/file/updateProjectPhotos/' + projectId, { 'fotoId': fotoId });
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

  deleteProjectCover(projectId) {
    this.projectService.getProject(projectId).subscribe((res) => {
      const fotoId = res.fotoCapaId;
      const projId = res._id;
      this.deletePhoto(fotoId).subscribe(() => {
        return this.http.delete('/api/file/deleteCoverPhoto/' + projId + '/' + fotoId);
      })

    });
  }


  deleteProjectPhoto(projectId, fotoId) {
    this.projectService.getProject(projectId).subscribe((res) => {
      const id = res.fotosId.find(fotoId);
      console.log('id :>> ', id);
      const projId = res._id;
      this.deletePhoto(fotoId).subscribe(() => {
        return this.http.delete('/api/file/deleteProjectPhoto/' + projId + '/' + fotoId);
      })
    });
  }

  deleteProfilePhoto(userId) {
    this.userService.getUser(userId).subscribe((res) => {
      const fotoId = res.fotoPerfilId;
      const id = res._id;
      this.deletePhoto(fotoId).subscribe(() => {
        return this.http.delete('/api/file/deleteProfilePhoto/' + id + '/' + fotoId);
      });
    });
  }


}
