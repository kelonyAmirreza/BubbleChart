import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { BackendService } from '../backend.service';
import * as XLSX from 'xlsx';
import 'chartjs-adapter-moment';
import { weekdays } from 'moment';

@Component({
  selector: 'app-bubble-charting-component',
  templateUrl: './bubble-charting-component.component.html',
  styleUrls: ['./bubble-charting-component.component.scss'],
})
export class BubbleChartingComponentComponent {
  constructor(private backendService: BackendService) {}
  public chart1: any;

  private excelDataRaw: any;

  private options1: any = {
    aspectRatio: 2.5,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sellers bubble chart',
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
        min: '2020-01-01',
        max: '2023-01-01',
        type: 'time',
        time: {
          unit: 'year',
        },
        title: {
          display: true,
          text: 'Time',
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
          autoSkip: true,
          //   maxTicksLimit: 10,
          color: 'white',
          font: {
            size: 20,
          },
          maxRotation: 90,
          minRotation: 90,
        },
      },

      y: {
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
    this.createChart1();
    this.read();
  }

  /* create the chart element for the FE*/
  createChart1() {
    this.chart1 = new Chart('bubbleChartFig1', {
      type: 'bubble', //this denotes tha type of chart
      data: {
        datasets: [
          {
            label: 'Men',
            data: [{}],
            backgroundColor: 'rgba(30,144,255,0.6)',
          },
        ],
      },
      options: this.options1,
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

          this.updateData1(27);
        };
      });
  }

  /* 
    1. Create an object for each user to calculate total contract sold and total benefit
    2. Find top % of the users accroding ro proftability
    3. Update the chart for the profitable users
  */
  updateData1(bestPercent: any) {
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

    let maxContarct: number = 0;
    for (let key in _excelData) {
      maxContarct =
        _excelData[`${key}`]['Numero di contratti venduti'] > maxContarct
          ? _excelData[`${key}`]['Numero di contratti venduti']
          : maxContarct;
    }

    let maxAmount: any,
      _data1: any = [],
      _data2: any = [];
    for (let i = 0; i < numberToConsider; i++) {
      maxAmount = [0, 'a'];
      for (let key in _excelData) {
        maxAmount =
          _excelData[`${key}`]['Somma guadagnata in euro'] > maxAmount[0]
            ? [_excelData[`${key}`]['Somma guadagnata in euro'], key]
            : maxAmount;
      }
      if (_excelData[`${maxAmount[1]}`]['Sesso'] === 'M') {
        _data1.push({
          x:
            numberToConsider === 1
              ? new Date((84240000000 / numberToConsider) * i + 1583017200000)
              : new Date(
                  (84240000000 / (numberToConsider - 1)) * i + 1583017200000
                ),
          y: maxAmount[0],
          r:
            (65 / maxContarct) *
              _excelData[`${maxAmount[1]}`]['Numero di contratti venduti'] +
            5,
        });
      } else {
        _data2.push({
          x:
            numberToConsider === 1
              ? new Date((84240000000 / numberToConsider) * i + 1583017200000)
              : new Date(
                  (84240000000 / (numberToConsider - 1)) * i + 1583017200000
                ),
          y: maxAmount[0],
          r:
            (65 / maxContarct) *
              _excelData[`${maxAmount[1]}`]['Numero di contratti venduti'] +
            5,
        });
      }
      delete _excelData[`${maxAmount[1]}`];
    }

    this.chart1.data.datasets = [
      {
        label: 'MEN',
        data: _data1,
        backgroundColor: 'rgba(30,144,255,0.6)',
        borderColor: 'rgb(30,144,255)',
      },
      {
        label: 'WOMEN',
        data: _data2,
        backgroundColor: 'rgba(105,105,105,0.6)',
        borderColor: 'rgb(105,105,105)',
      },
    ];
    this.chart1.update();
  }
}

/*
sample of json imported from excel
{
    'Data': 'Friday, January 28, 2022',
    'Nome': 'Federica',
    'Numero di contratti venduti': '1',
    'Random Number': '3',
    'Sesso': 'F',
    'Somma guadagnata in euro': ' € 965,407.00 ',
  }
*/
