import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { AlertService } from '../services/alert.service';
import { FotoService } from '../services/foto.service';
import { ActivatedRoute } from '@angular/router';
import { Foto } from 'models/foto';
import { Project } from 'models/projeto';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  project1: Project;
  project2: Project;
  project3: Project;
  fotos: Array<any> = [];
  projectPhotos: Array<any> = [];

  constructor(private fotoService: FotoService, private route: ActivatedRoute, private projectService: ProjectService) { }


  ngOnInit(): void {
    this.projectService.projects().subscribe((projects) => {

      this.fotoService.getAllDecodedCarouselFotos().then((fotos) => {
        this.fotos = fotos;
      });
      this.fotoService.getAllDecodedProjectFotos().then((fotos) => {
        this.projectPhotos = fotos;
      });
      const top3 = projects.filter((elem) => { if (elem.projetoMes.state) return elem });
      this.project1 = top3.find((elem) => { if (elem.projetoMes.position == 1) return elem });
      this.project2 = top3.find((elem) => { if (elem.projetoMes.position == 2) return elem });
      this.project3 = top3.find((elem) => { if (elem.projetoMes.position == 3) return elem });
    })
  }

  getSrc(fotoId) {
    const foto = this.fotos.find(elem => elem.id == fotoId);
    if (foto) {
      return 'data:' + foto.contentType + ';base64,' + foto.src;
    }
    else {
      const f = this.projectPhotos.find(elem => elem.id == fotoId);
      if (f) {
        return 'data:' + f.contentType + ';base64,' + f.src;

      }
      return "https://higuma.github.io/bootstrap-4-tutorial/img/286x180.svg";
    }
  }


}

