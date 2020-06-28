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
  getDecodedFotos(arrIds, type): Promise<void> {
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<void> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })

    //get fotos from Database
    this.getFotos(arrIds, type).subscribe((fotos) => {
      var binary = '';
      var arr = [];
      //decode each foto

      fotos.forEach((foto) => {
        let obj = {
          id: foto._id,
          src: this.arrayBufferToBase64(foto.foto.data.data),
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
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }
  getFotos(arrId, type) {
    if (arrId == undefined)
      arrId = "";
    return this.http.get<Foto[]>('/api/foto', {
      params: new HttpParams({ fromObject: { ids: arrId, type: type } })
    });
  }



  geDecodedProjectFotos(projectId): Promise<Array<any>> {
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<Array<any>> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })

    this.projectService.getProject(projectId).subscribe((p) => {
      let fotos = [];
      p.fotosId.forEach((id) => {
        fotos.push(id);
      })
      //returns a promise
      resolveRef(this.getDecodedFotos(fotos, 'projects'));
    })

    return dataPromise;
  }
  getAllDecodedProjectFotos(): Promise<Array<any>> {
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
        if (elem.fotoCapaId)
          fotos.push(elem.fotoCapaId);
      })
      //returns a promise
      resolveRef(this.getDecodedFotos(fotos, 'projects'));
    })

    return dataPromise;
  }
  getAllDecodedCarouselFotos(): Promise<Array<any>> {
    let resolveRef;
    let rejectRef;

    //create promise
    let dataPromise: Promise<Array<any>> = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    })

    //returns a promise
    resolveRef(this.getDecodedFotos('', 'carousel'));


    return dataPromise;
  }


  getUserPhoto(fotoId) {
    return this.getDecodedFotos(fotoId, 'users');
  }
}
