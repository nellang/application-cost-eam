import { Component } from '@angular/core';
import {NavbarService} from "./navbar.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome to EAM Lab';

  public BusinessFunction ={test : "max", }
  public BusinessClicked = false;

  onSelect(){
    this.BusinessClicked=true;
  }

  menueList = [
  {
    name: "Business Function",
    slug: "function"
  },
{
    name: "Application",
    slug: "application"
  } ];
  constructor(private navbarService: NavbarService) { }
}
