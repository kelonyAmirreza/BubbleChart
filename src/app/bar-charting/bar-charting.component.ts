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
      .get('assets/extracted_data.xlsx', {
        responseType: 'blob',
      })
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

          this.updateData2(1);
        };
      });
  }

  updateData2(bestPercent: any) {
    const percent = Number(bestPercent);
    const numberToConsider = Math.floor(
      this.excelDataRaw.length * percent * 0.01
    );

    let topSellers: any = {};
    for (let i = 0; i < numberToConsider; i++) {
      let maxBenefit = 0;
      for (let ii = 0; ii < this.excelDataRaw.length; ii++) {
        if (
          this.excelDataRaw[ii]['Somma guadagnata in euro'] > maxBenefit &&
          topSellers[`${this.excelDataRaw[ii]['Contract No']}`] === undefined
        ) {
          maxBenefit = this.excelDataRaw[ii]['Somma guadagnata in euro'];
        }
      }

      for (let ii = 0; ii < this.excelDataRaw.length; ii++) {
        if (this.excelDataRaw[ii]['Somma guadagnata in euro'] === maxBenefit) {
          topSellers[`${this.excelDataRaw[ii]['Contract No']}`] = i;
        }
      }
    }

    let _dataM: any = [0, 0, 0, 0, 0, 0, 0],
      _dataF: any = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < this.excelDataRaw.length; i++) {
      if (topSellers[`${this.excelDataRaw[i]['Contract No']}`] !== undefined) {
        if (this.excelDataRaw[i]['PH Gender'] === 'Female') {
          switch (this.excelDataRaw[i]['Application Day']) {
            case 'Mon':
              _dataF[0] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Tue':
              _dataF[1] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Wed':
              _dataF[2] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Thu':
              _dataF[3] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Fri':
              _dataF[4] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Sat':
              _dataF[5] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Sun':
              _dataF[6] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
          }
        } else if (this.excelDataRaw[i]['PH Gender'] === 'Male') {
          switch (this.excelDataRaw[i]['Application Day']) {
            case 'Mon':
              _dataM[0] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Tue':
              _dataM[1] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Wed':
              _dataM[2] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Thu':
              _dataM[3] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Fri':
              _dataM[4] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Sat':
              _dataM[5] += Number(
                this.excelDataRaw[i]['Somma guadagnata in euro']
              );
              break;
            case 'Sun':
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
