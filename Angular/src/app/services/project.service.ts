import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../../models/projeto';
import { ProjetoResponse, ImageResponse } from '../../../models/responseInterfaces';
import { Inscricao } from 'models/inscricao';
import { Observable, from } from 'rxjs';
import { User } from '../../../models/utilizadores';

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

  removeCoverPhoto(id){
    return this.http.put<Project>('/api/project/'+id, {fotoCapaId: null});
  }

  updateProjectPhotos(id, photos){
    return this.http.put<Project>('/api/project/'+id, {fotosId: photos});
  }

  editProject(id, obj){
    return this.http.put<Project>('/api/project/'+id, obj);
  }

  deleteProject(id){
    return this.http.delete<Project>('/api/project/'+id);
  }

  getProject(id) {
    return this.http.get<Project>('/api/project/' + id);
  }

  addProject(formBody): Observable<ProjetoResponse> {
    console.log(formBody);
    return this.http.post<ProjetoResponse>('/api/project', formBody, this.httpOptions);
  }

  uploadPhoto(formData) {
    return this.http.post<ImageResponse>('/api/file/uploadCapaFoto', formData);
  }

  getGestores(projectId){
    return this.http.get<User[]>("api/project/gestores/"+projectId);
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
