import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Foto } from '../../../models/foto';
import { ProjectService } from './project.service';


@Injectable({
  providedIn: 'root'
})
export class FotoService {

  constructor(private http: HttpClient, private projectService: ProjectService) { }

  //return promise with an object {id, src, contentType} or error
  getDecodedFotos(arrIds): Promise<void>{
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<void> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })

    //get fotos from Database
    this.getFotos(arrIds).subscribe((fotos) => {
      var binary = '';
      var arr = [];
      //decode each foto
      fotos.forEach((foto) => {
        var bytes = [].slice.call(new Uint8Array(foto.foto.data.data));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        let obj = {
          id: foto._id,
          src: window.btoa(binary),
          contentType: foto.foto.contentType
        };
        arr.push(obj);
      });
      //return obj with success
      resolveRef(arr);
    }, (err) => {
      //return err in case something went wrong
      rejectRef(err);
    })
    //return promise
    return dataPromise;
  }

  getFotos(arrId){
    if(arrId == undefined)
      arrId = "";
    return this.http.get<Foto[]>('/api/foto', {
      params: new HttpParams().set('ids', arrId)
    });
  }

  getAllDecodedProjectFotos(): Promise<Array<any>>{
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<Array<any>> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })

    this.projectService.projects().subscribe((projects) => {
      let fotos = [];
      projects.forEach((elem) => {
        if(elem.fotoCapaId)
          fotos.push(elem.fotoCapaId);
      })
      //returns a promise
      resolveRef(this.getDecodedFotos(fotos));
    })

    return dataPromise;
  }
}
