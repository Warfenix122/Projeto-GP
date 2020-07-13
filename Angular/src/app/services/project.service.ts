import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../../models/projeto';
import { ProjetoResponse, ImageResponse } from '../../../models/responseInterfaces';
import { Inscricao } from 'models/inscricao';
import { Observable, from } from 'rxjs';
import { User } from '../../../models/utilizadores';
import {Atividade} from '../../../models/atividade';


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
    return this.http.get<Project[]>('/api/project/aprovedProjects');
  }
  userFavoriteProjects(userId) {
    return this.http.get<Project[]>('/api/project/favoriteProject/' + userId);
  }

  userRegisterProjects(userId) {
    return this.http.get<Project[]>('/api/project/registerProject/' + userId);
  }

  removeCoverPhoto(id) {
    return this.http.put<Project>('/api/project/' + id, { fotoCapaId: null });
  }

  updateProjectPhotos(id, photos) {
    return this.http.put<Project>('/api/project/' + id, { fotosId: photos });
  }

  editProject(id, obj) {
    return this.http.put<Project>('/api/project/edit/' + id, obj);
  }

  deleteProject(id) {
    return this.http.delete<Project>('/api/project/getProject/' + id);
  }

  getProject(id) {
    return this.http.get<Project>('/api/project/getProject/' + id);
  }

  addProject(formBody): Observable<ProjetoResponse> {
    console.log(formBody);
    return this.http.post<ProjetoResponse>('/api/project', formBody, this.httpOptions);
  }

  uploadPhoto(formData) {
    return this.http.post<ImageResponse>('/api/file/uploadCapaFoto', formData);
  }

  getGestores(projectId) {
    return this.http.get<User[]>("api/project/gestores/" + projectId);
  }

  volunteer(projectId, voluntarioId) {
    let volId = { userId: voluntarioId }
    return this.http.put<ImageResponse>('/api/project/candidatar/' + projectId, volId);
  }

  cancelVolunteer(projectId, voluntarioId) {
    let volId = { voluntarioId: voluntarioId }
    return this.http.put<ImageResponse>('/api/project/anularCandidatura/' + projectId, volId);
  }

  getToAproveProjects() {
    return this.http.get<Project[]>('api/project/pendingProjects');
  }

  aproveProject(formBody) {
    return this.http.put('api/project/avaliarProjeto', formBody);
  }

  getComments(projectId) {
    return this.http.get<Comment[]>('/api/project/comments/' + projectId);
  }

  addComment(formBody, projectId) {
    return this.http.put('api/project/addComment/' + projectId, formBody);
  }

  removeComment(projectId, commentId) {
    let body = { commentId: commentId };
    return this.http.put('api/project/removeComment/' + projectId, body);
  }

  writeFile(projectId) {
    return this.http.get<JSON>('/api/project/writeFile/' + projectId);
  }

  markAsTop(id, position){
    return this.http.get<Project>('/api/project/markTop/' + id+"/"+position);
  }
  dismarkAsTop(id){
    return this.http.get<Project>('/api/project/dismarkTop/' + id);
  }

  getAtividades(id){
    return this.http.get<Atividade[]>('/api/project/atividades/'+id);
  }
  
  removerAtividades(id,atividadeId){
    let atId = {atividadeId:atividadeId};
    return this.http.put<ImageResponse>('/api/project/atividades/remover/'+id,atId);
  }

  addAtividade(id,atividade){
    console.log(atividade);
    return this.http.post('/api/project/atividades/'+id,atividade);
  }
  
  editAtividade(id,atividade){
    return this.http.put('/api/project/atividades/'+id,atividade);
  }
}
