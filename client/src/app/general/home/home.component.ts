import { Component, OnInit, Injectable, Inject } from '@angular/core'


@Component({
  selector: 'wcga-home',
  templateUrl: './home.component.html',
})
@Injectable()
export class HomeComponent implements OnInit {

  constructor(@Inject('Window') private window: Window) { }

  ngOnInit() {
    // (window as any).iosFallbackTest()
  }

}
