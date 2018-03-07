import { Component, OnInit, OnChanges } from '@angular/core'
import { AppCommEvent } from '../../classes/appcomm.event.class'
import { AppCommService } from '../../app-comm.service'

@Component({
  selector: 'wcga-sentiment-chart',
  templateUrl: './sentiment-chart.component.html',
  styleUrls: ['./sentiment-chart.component.css']
})
export class SentimentChartComponent implements OnInit, OnChanges {

  public sentimentData: Array<number> = [0]
  public sentimentLabel: string = 'neutral'
  public primaryEmotion: string = 'none'
  public emotionLabel: string = ', but you haven\'t said anything yet!'
  public currentIntent: string = 'none'
  public intentConfidenceLabel: string = ', but you haven\'t said anything yet!'
  private sentMessages: Array<string> = []
  public lineChartData: Array<any>
  public lineChartLabels: Array<any>
  public lineChartOptions: any
  public lineChartColors: Array<any>
  public lineChartLegend: boolean
  public lineChartType: string

  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      //
      // Message Sent Standard Event
      //
      if (event.type === AppCommService.typeEnum.conversationSent && event.subType === AppCommService.subTypeEnum.conversationSent.standard) {
        this.sentMessages.push(event.data)
      }
      //
      // Sentiment Received Standard Event
      //
      if (event.type === AppCommService.typeEnum.alchemy && event.subType === AppCommService.subTypeEnum.alchemy.sentiment) {
        let sentimentScore = Number(event.data.sentimentScore) * 100
        this.sentimentData.push(sentimentScore)
        if (sentimentScore < -80 ) {
          this.sentimentLabel = 'very negative'
        } else if (sentimentScore < -30 ) {
          this.sentimentLabel = 'negative'
        } else if (sentimentScore < 30 ) {
          this.sentimentLabel = 'neutral'
        } else if (sentimentScore < 80 ) {
          this.sentimentLabel = 'positive'
        } else if (sentimentScore >= 80 ) {
          this.sentimentLabel = 'very positve'
        }
        this.updateData()
      }
      //
      // Emotion Received Standard Event
      //
      if (event.type === AppCommService.typeEnum.alchemy && event.subType === AppCommService.subTypeEnum.alchemy.emotion) {
        let emotionScore = Number(event.data.primaryEmotionScore) * 100
        this.primaryEmotion = event.data.primaryEmotion
        if (emotionScore < 40 ) {
          this.emotionLabel = '.'
          this.primaryEmotion = 'none'
        } else if (emotionScore < 60 ) {
          this.emotionLabel = ', and I\'m pretty confident in that.'
        } else if (emotionScore < 80 ) {
          this.emotionLabel = ', and I\'m confident in that.'
        } else if (emotionScore >= 80 ) {
          this.emotionLabel = ', and I\'m very confident in that.'
        }
      }
      if (event.type === AppCommService.typeEnum.conversationIntentsReceived) {
        let intents = event.data
        if (intents && intents.length > 0) {
          this.currentIntent = intents[0].intent
          if (intents[0].confidence < 0.4) {
            this.intentConfidenceLabel = ', but I\'m not confident in that'
          } else if (intents[0].confidence < 0.6) {
            this.intentConfidenceLabel = ', and I\'m pretty confident in that.'
          } else if (intents[0].confidence < 0.8) {
            this.intentConfidenceLabel = ', and I\'m confident in that.'
          } else if (intents[0].confidence > 0.8) {
            this.intentConfidenceLabel = ', and I\'m very confident in that.'
          }
        } else {
          this.currentIntent = 'none'
          this.intentConfidenceLabel = '.'
        }
      }
    })
  }

  ngOnInit() {
    this.lineChartData = [
      {data: [0], label: 'User Sentiment'}
    ]
    this.lineChartLabels = Array(this.lineChartData[0].data.length).fill('')
    this.lineChartOptions = {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Customer Sentiment'
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Sentiment Score'
          },
          ticks: {
            min: -100,
            max: 100
          }
        }],
        xAxes: [{
          ticks: {
            display: true,
            maxRotation: 0
          },
          gridLines: {
            display: false
          }
        }]
      }
    }
    this.lineChartColors = [
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ]
    this.lineChartLegend = false
    this.lineChartType = 'line'
  }
  ngOnChanges() {
    this.updateData()
  }

  updateData() {
    this.lineChartData = [
      {data: this.sentimentData, label: 'User Sentiment'}
    ]
    this.lineChartLabels = Array(this.lineChartData[0].data.length).fill('')
    this.lineChartLabels[this.lineChartLabels.length - 1] = 'Latest Message'
  }

}
