import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from '../../../models/utilizadores';
import { Project } from 'models/projeto';
import { ProjectService } from './project.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private userService: UserService, private projectService: ProjectService, private _alertService:AlertService) { }

  updateProfilePhoto(formdata): Promise<User> {
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<User> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })

    formdata.append('type', 'users')
    this.userService.getCurrentUserId().subscribe((userId) => {
      this.uploadPhoto(formdata).subscribe((res) => {
        this.updateUserPhoto(res['fotoId'], userId['UserID']).subscribe((res) => {
          resolveRef(res['user']);
        }, (err) => rejectRef(err));
      });
    });

    return dataPromise;
  }

  updateCoverPhoto(formdata) {
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<Project> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })
    formdata.append('type', 'projects');
    var projId = formdata.get('projectId');
    this.projectService.getProject(projId).subscribe((project) => {
      this.uploadPhoto(formdata).subscribe((res) => {
        this.updateProjectCover(res['fotoId'], project._id).subscribe((res) => {
          resolveRef(res["project"])
          this._alertService.success("Foto alterada com sucesso");
        }, (err) => {
          rejectRef(err)
          this._alertService.error("Não foi possivel alterar a foto");
        })
      });
    })
    return dataPromise;
  }

  updateProjectPhotoFiles(formdata) {
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<Project> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })
    formdata.append('type', 'projects');
    var projId = formdata.get('projectId');
    this.projectService.getProject(projId).subscribe((project) => {
      this.uploadPhoto(formdata).subscribe((res) => {
        this.updateProjectPhotos(res['fotoId'], project._id).subscribe((res) => {
          resolveRef(res["project"])
          this._alertService.success("Foto alterada com sucesso");
        }, (err) => {
          rejectRef(err)
          this._alertService.error("Não foi possivel alterar a foto");
        })
      });
    })
    return dataPromise;
  }
  updateCarouselPhoto(formdata) {
    formdata.append('type', 'carousel');
    return this.uploadPhoto(formdata)
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
}
