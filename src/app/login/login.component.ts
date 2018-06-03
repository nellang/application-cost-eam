import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {NavbarService} from '../navbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  hasError = false;

  constructor(private router: Router, private navbarService: NavbarService, private authService: AuthenticationService) {  }

  ngOnInit() {
   // this.navbarService.hide();
  }

  login() {
    this.loading = true;
    this.authService.login(this.model.username, this.model.password).subscribe(
      value => {
        this.loading = false;
        if (value) {
          this.hasError = false;
          this.navbarService.show();
          this.router.navigate(['home']);
        }else {
          this.hasError = true;
        }
      },
      error => {
        this.hasError = true;
        this.loading = false;
    });
  }

}
