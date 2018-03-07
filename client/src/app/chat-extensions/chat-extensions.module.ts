import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SentimentChartComponent } from './sentiment-chart/sentiment-chart.component'
import { ChartsModule } from 'ng2-charts/ng2-charts'
import { FormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap'

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    SentimentChartComponent,
  ],
  declarations: [
    SentimentChartComponent,
  ]
})
export class ChatExtensionsModule { }
