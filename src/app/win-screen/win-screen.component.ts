import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, registerables, Filler } from 'chart.js';
import { NavService } from '../navigation/nav.service';
import { graphingData, ipaStruct } from '../ipaStruct';

@Component({
  selector: 'app-win-screen',
  templateUrl: './win-screen.component.html',
  styleUrls: ['./win-screen.component.scss']
})
export class WinScreenComponent implements OnInit {
  @Output() playAgainSignal = new EventEmitter<boolean>();
  
  constructor(private nav: NavService) { }

  winChart!: Chart;

  wpm: graphingData[] = [];
  
  errors: number[] = [];
  wordsPerMin: number[] = [];
  word: string[] = [];

  averageWPM: number = 0;
  errorCount: number = 0;

  mode: string = '';
  difficulty: string = '';
  time: number | undefined;
  accuracy: number = 0;

  ngOnInit(): void {
    this.mode = this.nav.getQuizMode();
    this.difficulty = this.nav.getDifficulty();
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler);
    this.wpm.push({time: 0, errors: -1});
    this.pieChartBrowser(); 
  }

  playAgain = (sameWords: boolean) => {
    
    this.playAgainSignal.emit(sameWords);
    this.errorCount = 0;
    this.wpm.push({time: 0, errors: -1});
  }

  updateData = () =>  {
    this.wordsPerMin = [];
    this.errors = [];
    this.word = [];
    this.errorCount = 0;

    this.mode = this.nav.getQuizMode();
    this.difficulty = this.nav.getDifficulty();
    if  (this.mode == 'timed') { this.time = this.nav.getActiveTime(); } 
    else { this.time = undefined; }

    this.computeAverageWPM();

    this.wordsPerMin.push(this.averageWPM);
    this.word.push('1');
    for (let i = 1; i < this.wpm.length; i++) {
      this.wordsPerMin.push(60000 / this.wpm[i].time);
      if (this.wpm[i].errors > 0){ this.errors.push(this.wpm[i].errors); this.errorCount += this.wpm[i].errors; }
      this.word.push((i+1).toString());
    }

    this.accuracy = Math.floor(this.word.length * 100 / (this.word.length + this.errorCount));

    this.winChart.destroy();
    this.pieChartBrowser();
    console.log(this.word)
  }

  computeAverageWPM = () => {
    let totalWPM = 0;
    for (let i = 1; i < this.wpm.length - 1; i++) {
      totalWPM += 60000 / this.wpm[i].time;
    }
    this.averageWPM = Math.floor(totalWPM / (this.wpm.length - 2));
  }


  pieChartBrowser(): void {
    this.winChart = new Chart('winChart', {
      type: 'line',
      data: {
        labels: this.word,
        datasets: [{
          fill: true,
          backgroundColor: 'rgb(255,255,255, 0.25)',
          label: 'WPM',
          yAxisID: 'WPM',
          data: this.wordsPerMin,
          tension: 0.2,
          borderColor: 'rgba(255,255,255, 0.75)',
          pointBackgroundColor: '#F2AF29',
          pointBorderColor: '#F2AF29',
          
        },{
          label: 'Errors',
          yAxisID: 'Errors',
          data: this.errors,
          showLine: false,
          pointStyle: 'crossRot',
          pointBackgroundColor: '#AD343E',
          pointBorderColor: '#AD343E',
          pointBorderWidth: 2,
          pointRadius: 5,
        }]
      },
      options: {
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
            title: {
              display: true,
              text: 'Words',
              font: {
                size: 15,
                family: 'Roboto Mono, monospace'
              },
            },
            
            min: 0,
            max: this.word.length + 1,
          },
          'WPM': {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'words per min',
              color: '#F2AF29',
              font: {
                size: 20,
                family: 'Roboto Mono, monospace'
              }
            },
            min: 0,
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
            ticks: { 
              callback: function(value: any, index, ticks) {
            
                if (value % 1 === 0) {
                  return value;
                }
              }
            }
          },
          'Errors': {
            type: 'linear',
            position: 'right',
            min: 0,
            max: this.errorCount + 1,
            title: {
              display: true,
              text: 'errors',
              color: '#AD343E',
              font: {
                size: 20,
                family: 'Roboto Mono, monospace'
              }
            },
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
