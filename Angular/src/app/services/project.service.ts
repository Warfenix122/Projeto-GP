import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../../models/projeto';
import { ProjetoResponse, ImageResponse } from '../../../models/responseInterfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class ProjectService {
  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }


  closeApplications(projectId) {
    let obj = {
      dataFechoInscricoes: new Date(),
    };
    return this.http.put<Project>('/api/project/' + projectId, obj);
  }

  projects() {
    return this.http.get<Project[]>('/api/project');
  }
  userFavoriteProjects(userId) {
    console.log('userId :>> ', userId);
    return this.http.get<Project[]>('/api/project/favoriteProject/' + userId);
  }


  getProject(id) {
    return this.http.get<Project>('/api/project/' + id);
  }

  addProject(formBody): Observable<ProjetoResponse> {
    return this.http.post<ProjetoResponse>('/api/project', formBody, this.httpOptions);
  }

  uploadPhoto(formData) {
    return this.http.post<ImageResponse>('/api/file/uploadCapaFoto', formData);
  }

  addFavProject(userId, projectId){
    return this.http.put<Project>('/api/fav', userId, projectId);
  }
}
