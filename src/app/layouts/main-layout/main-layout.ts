import { Component } from '@angular/core';
import { Navbar } from '../../features/landing/components/navbar/navbar';
import { Footer } from '../../features/landing/components/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar,Footer,RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
