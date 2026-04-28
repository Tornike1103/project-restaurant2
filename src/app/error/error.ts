import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './error.html',
  styleUrls: ['./error.scss'],
})
export class ErrorPage {}
