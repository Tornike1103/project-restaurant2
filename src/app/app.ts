import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Alert } from './alert/alert';
import { Dialog } from './dialog/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, Alert, Dialog],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  title = signal('Foodie');
}