import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  public color: string = '';
  public mode: string = '';
  public value: number = 0;
  ngOnInit(){
    this.color = 'primary';
    this.mode = 'indeterminate';
    this.value = 1;
  }

}
