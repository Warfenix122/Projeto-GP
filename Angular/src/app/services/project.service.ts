import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../../models/projeto';
import { ProjetoResponse, ImageResponse } from '../../../models/responseInterfaces';
import { Observable } from 'rxjs';
import { Inscricao } from 'models/inscricao';

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
    return this.http.get<Project[]>('/api/project/favoriteProject/' + userId);
  }

  userRegisterProjects(userId){
    return this.http.get<Inscricao[]>('/api/project/registerProject/' + userId);
  }

  editProject(id, obj){
    return this.http.put<Project>('/api/project/'+id, obj);
  }

  //deleteProject(id)

  getProject(id) {
    return this.http.get<Project>('/api/project/' + id);
  }

  addProject(formBody): Observable<ProjetoResponse> {
    return this.http.post<ProjetoResponse>('/api/project', formBody, this.httpOptions);
  }

  uploadPhoto(formData) {
    return this.http.post<ImageResponse>('/api/file/uploadCapaFoto', formData);
  }

  volunteer(projectId,voluntarioId){
    let volId = {voluntarioId:voluntarioId}
    return this.http.put<ImageResponse>('/api/project/candidatar/'+projectId,volId);
  }

  cancelVolunteer(projectId,voluntarioId){
    let volId = {voluntarioId:voluntarioId}
    return this.http.put<ImageResponse>('/api/project/anularCandidatura/'+projectId,volId);
  }
}
