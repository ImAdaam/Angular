import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService]
})

export class AppComponent {
  title = 'beadando';
}
  

