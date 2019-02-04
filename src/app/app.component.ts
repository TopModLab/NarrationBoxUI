import {Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{
    currentUser: User;
    Titlebarflag: boolean = true;

    constructor(
        private router: Router,
        private titleService: Title,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
      this.titleService.setTitle('Story Telling App');
    }


  logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
