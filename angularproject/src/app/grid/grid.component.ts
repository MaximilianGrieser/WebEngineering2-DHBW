import { Component, OnInit } from '@angular/core';

const today = new Date();
const todayDate = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();
const todayDay = today.getDay();

const currentDate = today.getDate();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const openDate = today.getDate();

const selectedId = -1;
const selectedRow = -1;
const selectedCell = -1;

const counter = 0;

const months = ['JANNUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const options = [];
const daysGrid = [
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X']
];
const appointmentsGrid = [
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X']
];
let appointmentsList;

const isNewEntry = true;
const firstLoad = true;
// tslint:disable-next-line:prefer-const
let currentUser;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

  constructor() {  }

  ngOnInit(): void {
    this.loadAppointmentsFromDataBase();
  }
  loadAppointmentsFromDataBase(): void{
    const request = new XMLHttpRequest();

    request.onreadystatechange = function(): void {
      if (this.readyState === 4 && this.status === 200) {
        appointmentsList = JSON.parse(this.responseText);
        console.log('Read Apponitmens:');
        console.log(appointmentsList);
      }
    };
    /*
    request.open('GET', 'http://localhost:3000/events/' + currentUser, false);
    console.log('http://localhost:3000/events/' + currentUser);
    request.send();

     */

    this.showCalendar(currentMonth, currentYear);
  }
    showCalendar(month, year): void {
    const firstDay = ((new Date(year, month)).getDay());
    const daysInMonth = 32 - new Date(year, month, 32).getDate();
    const daysInPrevMonth = 32 - new Date(year, month - 1, 32).getDate();
    const startDaysInPrevMonth = (32 - new Date(year, month - 1, 32).getDate()) - (firstDay - 1);
    let nextMonthReset = true;
    let prevMonthReset = true;

    document.getElementById('currMonth').innerHTML = months[month] + ' ' + year;

    this.clearGrid();

    let date = 1;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        // Days in Prev Month
        if ((i === 0 && j < firstDay) || !prevMonthReset) {
          if (prevMonthReset) {
            prevMonthReset = false;
            date = startDaysInPrevMonth;
          }
          if (date < daysInPrevMonth) {
            daysGrid[i][j] = String(date);
            document.getElementById('weekday_days_' + (j) + '_row_' + (i)).classList.add('day-not-in-month');
          } else {
            daysGrid[i][j] = String(date);
            document.getElementById('weekday_days_' + (j) + '_row_' + (i)).classList.add('day-not-in-month');
            date = 0;
            prevMonthReset = true;
          }
          // Days in Next Month
        } else if ((date > daysInMonth) || !nextMonthReset) {
          if (nextMonthReset) {
            nextMonthReset = false;
            date = 1;
          }
          daysGrid[i][j] = String(date);
          document.getElementById('weekday_days_' + j + '_row_' + i).classList.add('day-not-in-month');
          // Days in Month
        } else {
          daysGrid[i][j] = String(date);
          if (year === todayYear && month === todayMonth && date === todayDate) {
            document.getElementById('weekday_days_' + j + '_row_' + i).classList.add('day-today');
          }
          /*
          const appointmentsAtDayList = this.appointmentsAtDay(year, month, date);
          if (appointmentsAtDayList.length > 0) {
            // @ts-ignore
            appointmentsGrid[i][j] = appointmentsAtDayList;
          }

           */
        }
        date++;
      }
    }
    console.log('DaysGrid:');
    console.log(daysGrid);
    console.log('AppointmentsGrid:');
    console.log(appointmentsGrid);
    this.printDaysGrid();
  }

  printDaysGrid(): void {
    for (let i = 0; i < 6; i++) {
      for (let y = 0; y < 7; y++) {
        const currElement = document.getElementById('weekday_days_' + y + '_row_' + i);
        currElement.innerHTML = daysGrid[i][y];
        if (appointmentsGrid[i][y] !== 'X') {
          let entrys = 0;
          appointmentsGrid.forEach(appointment => {
            if (entrys <= 2) {
              // currElement.innerHTML += '<br>' + appointment.title.substr(0, 12);
              entrys++;
            }
          });
        }
      }
    }
  }
/*
  appointmentsAtDay(year, month, date): object[] {
    const filterString = new Date(year, month, date + 1).toISOString().slice(0, 10);
    const appointmentsAtDayList = [];
    appointmentsList.forEach(appointment => {
      if (appointment.start.slice(0, 10).localeCompare(filterString) === 0) {
        appointmentsAtDayList.push(appointment);
      }
    });
    return appointmentsAtDayList;
  }


 */
  clearGrid(): void {
    for (let i = 0; i < 6; i++) {
      for (let y = 0; y < 7; y++) {
        document.getElementById('weekday_days_' + y + '_row_' + i).classList.remove('day-not-in-month');
        document.getElementById('weekday_days_' + y + '_row_' + i).classList.remove('day-today');
        daysGrid[i][y] = 'X';
        appointmentsGrid[i][y] = 'X';
      }
    }
  }

  nextMonth(): void {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    this.showCalendar(currentMonth, currentYear);
  }

  prevMonth(): void {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    this.showCalendar(currentMonth, currentYear);
  }

}
