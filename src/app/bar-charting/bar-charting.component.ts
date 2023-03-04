import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { BackendService } from '../backend.service';
import * as XLSX from 'xlsx';
import 'chartjs-adapter-moment';
import { weekdays } from 'moment';

@Component({
  selector: 'app-bar-charting',
  templateUrl: './bar-charting.component.html',
  styleUrls: ['./bar-charting.component.scss'],
})
export class BarChartingComponent {
  constructor(private backendService: BackendService) {}
  public chart2: any;

  private excelDataRaw: any;

  private options2: any = {
    aspectRatio: 2.5,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sellers bar chart',
        color: 'white',
        font: {
          size: 30,
        },
      },
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 20,
          },
        },
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },

        ticks: {
          autoSkip: true,
          color: 'white',
          font: {
            size: 20,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount of money\t(€)',
          color: 'white',
          font: {
            size: 20,
          },
        },
        border: {
          display: true,
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: 'white',
        },
        ticks: {
          color: 'white',
          font: {
            size: 20,
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.createChart2();
    this.read();
  }

  /* create the chart element for the FE*/
  createChart2() {
    let weekDaysLabel: string[] = weekdays();
    weekDaysLabel[6] = weekDaysLabel.shift()!;
    this.chart2 = new Chart('bubbleChartFig2', {
      type: 'bar', //this denotes tha type of chart
      data: {
        labels: weekDaysLabel,
        datasets: [
          {
            label: 'MEN',
            data: [],
            backgroundColor: ['rgba(30,144,255,0.6)'],
            borderColor: ['rgb(30,144,255)'],
            borderWidth: 1,
          },
          {
            label: 'WOMEN',
            data: [],
            backgroundColor: ['rgb(105,105,105,0.6)'],
            borderColor: ['rgb(105,105,105)'],
            borderWidth: 1,
          },
        ],
      },
      options: this.options2,
    });
  }

  /* Read data from excel file in asset folder*/
  read() {
    this.backendService
      .get('assets/data.xlsx', { responseType: 'blob' })
      .subscribe((data: any) => {
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(data);

        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          /* grab sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          this.excelDataRaw = XLSX.utils.sheet_to_json(ws, {
            raw: false,
            header: ws ? 0 : 1,
            dateNF: 'dd/mm/yyyy',
          });

          this.updateData2(27);
        };
      });
  }

  updateData2(bestPercent: any) {
    let _excelData: any = {};
    for (let i = 0; i < this.excelDataRaw.length; i++) {
      if (_excelData[`${this.excelDataRaw[i]['Nome']}`] === undefined) {
        _excelData[`${this.excelDataRaw[i]['Nome']}`] = {
          'Numero di contratti venduti': Number(
            this.excelDataRaw[i]['Numero di contratti venduti']
          ),
          Sesso: this.excelDataRaw[i]['Sesso'],
          'Somma guadagnata in euro': Number(
            this.excelDataRaw[i]['Somma guadagnata in euro']
          ),
        };
      } else {
        _excelData[`${this.excelDataRaw[i]['Nome']}`][
          'Numero di contratti venduti'
        ] += Number(this.excelDataRaw[i]['Numero di contratti venduti']);
        _excelData[`${this.excelDataRaw[i]['Nome']}`][
          'Somma guadagnata in euro'
        ] += Number(this.excelDataRaw[i]['Somma guadagnata in euro']);
      }
    }

    const percent = Number(bestPercent);
    const numberToConsider = Math.floor(
      Object.keys(_excelData).length * percent * 0.01
    );

    let topSellers: any = {};
    for (let i = 0; i < numberToConsider; i++) {
      let maxBenefit = 0;
      for (let key in _excelData) {
        if (
          _excelData[`${key}`]['Somma guadagnata in euro'] > maxBenefit &&
          topSellers[`${key}`] === undefined
        ) {
          maxBenefit = _excelData[`${key}`]['Somma guadagnata in euro'];
        }
      }
      for (let key in _excelData) {
        if (_excelData[`${key}`]['Somma guadagnata in euro'] === maxBenefit) {
          topSellers[`${key}`] = i;
        }
      }
    }

    let _dataM: any = [0, 0, 0, 0, 0, 0, 0],
      _dataF: any = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < this.excelDataRaw.length; i++) {
      if (topSellers[`${this.excelDataRaw[i]['Nome']}`] !== undefined) {
        if (this.excelDataRaw[i]['Sesso'] === 'F') {
          switch (this.excelDataRaw[i]['Data'].split(',')[0]) {
            case 'Monday':
              _dataF[0] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Tuesday':
              _dataF[1] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Wednesday':
              _dataF[2] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Thursday':
              _dataF[3] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Friday':
              _dataF[4] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Saturday':
              _dataF[5] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Sunday':
              _dataF[6] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
          }
        } else if (this.excelDataRaw[i]['Sesso'] === 'M') {
          switch (this.excelDataRaw[i]['Data'].split(',')[0]) {
            case 'Monday':
              _dataM[0] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Tuesday':
              _dataM[1] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Wednesday':
              _dataM[2] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Thursday':
              _dataM[3] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Friday':
              _dataM[4] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Saturday':
              _dataM[5] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Sunday':
              _dataM[6] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
          }
        }
      }
    }

    this.chart2.data.datasets[0].data = _dataM;
    this.chart2.data.datasets[1].data = _dataF;
    this.chart2.update();
  }
}
