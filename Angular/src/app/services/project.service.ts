import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../../models/projeto';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  closeApplications(projectId){
    let obj = {
      dataFechoInscricoes: new Date()
    };
    return this.http.put<Project>('/api/project/'+projectId, obj);
  }

  projects(){
    return this.http.get<Project[]>('/api/project');
  }

  getProject(id){
    return this.http.get<Project>('/api/project/'+id);
  }
}
