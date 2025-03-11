import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IsActiveMatchOptions, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isActiveMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };

}
