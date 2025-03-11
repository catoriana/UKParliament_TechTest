import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [FooterComponent, NavbarComponent, RouterModule],
})
export class LayoutComponent {

}
