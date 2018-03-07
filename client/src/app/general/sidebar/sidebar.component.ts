import { Component, ViewChild } from '@angular/core'
import { AppCommEvent } from '../../classes/appcomm.event.class'
import { AppCommService } from '../../app-comm.service'
import { ModalDirective } from 'ngx-bootstrap'

@Component({
  selector: 'wcga-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @ViewChild(ModalDirective) private detailsMobile: ModalDirective // Popup for mobile devices

  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      if (event.type === AppCommService.typeEnum.showDetailsPopup) {
        this.detailsMobile.show()
      }
    })
  }


}
