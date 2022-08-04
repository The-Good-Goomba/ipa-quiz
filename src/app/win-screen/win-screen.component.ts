import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, registerables } from 'chart.js';
import { graphingData } from '../ipaStruct';

@Component({
  selector: 'app-win-screen',
  templateUrl: './win-screen.component.html',
  styleUrls: ['./win-screen.component.scss']
})
export class WinScreenComponent implements OnInit {
  @Output() playAgainSignal = new EventEmitter();
  
  winChart!: Chart;

  wpm: graphingData[] = [];
  
  errors: number[] = [];
  wordsPerMin: number[] = [];
  word: string[] = [];

  errorCount: number = 0;

  ngOnInit(): void {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
    this.wpm.push({time: 0, errors: -1});
    this.pieChartBrowser(); 
  }

  playAgain = () => {
    this.playAgainSignal.emit();
    this.wpm.push({time: 0, errors: -1});
  }

  updateData = () =>  {
    this.wordsPerMin = [];
    this.errors = [];
    this.word = [];

    for (let i = 0; i < this.wpm.length; i++) {
      this.wordsPerMin.push(60000 / this.wpm[i].time);
      this.errors.push(this.wpm[i].errors);
      this.word.push((i+1).toString());
      if (this.errorCount < this.wpm[i].errors) {
        this.errorCount = this.wpm[i].errors;
      }
    }
    this.winChart.destroy();
    this.pieChartBrowser();
    console.log(this.word)
  }

  pieChartBrowser(): void {
    this.winChart = new Chart('winChart', {
      type: 'line',
      data: {
        labels: this.word,
        datasets: [{
          backgroundColor: [
            '#2ecc71',
            '#3498db',
            '#95a5a6',
            '#9b59b6',
            '#f1c40f',
            '#e74c3c'
          ],
          label: 'WPM',
          yAxisID: 'WPM',
          data: this.wordsPerMin,
          fill: true
        },{
          label: 'Errors',
          yAxisID: 'Errors',
          data: this.errors,
          backgroundColor: '#e74c3c',
          borderColor: 'rgba(255,255,255, 0)',
          pointStyle: 'crossRot'
        }]
      },
      options: {
        scales: {
          'WPM': {
            type: 'linear',
            position: 'left',
          },
          'Errors': {
            type: 'linear',
            position: 'right',
            min: 0,
            max: this.errorCount + 1,
            ticks: { 
              callback: function(value: any, index, ticks) {
            
                if (value % 1 === 0) {
                  return value;
                }
              }
            }

          }
        },
      }
  });
  }

}
