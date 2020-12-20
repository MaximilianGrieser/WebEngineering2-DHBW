import {Component, OnInit} from '@angular/core';
import {SessionService} from "../session.service";
import {ApiService} from "../api.service";
import $ from "jquery";

const today = new Date();
const todayDate = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();
const todayDay = today.getDay();

const currentDate = today.getDate();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let openDate: any = today.getDate();

let selectedId = -1;
let selectedRow = -1;
let selectedCell = -1;

let counter = 0;

const months = ['JANNUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const options = [];
let groups: any = [];
const daysGrid = [
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X']
];
let appointmentsGrid: any = [
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X']
];
let appointmentsList;

let isNewEntry = true;
const firstLoad = true;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {


  constructor(private session: SessionService, private api: ApiService) {
  }

  ngOnInit(): void {
    this.loadAppointmentsFromDataBase();
  }

  loadAppointmentsFromDataBase(): void {
    this.api.getEvents(this.session.getUser()).subscribe((data) => {
      appointmentsList = data;
      console.log(appointmentsList);
      this.loadCategorysFromDataBase();
      this.showCalendar(currentMonth, currentYear);
    });

  }

  /**
   * Fills arrays: daysGrid  with correct dates and appointmentsGrid with appointments
   * @param month
   * @param year
   */
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

          const appointmentsAtDayList = this.appointmentsAtDay(year, month, date);
          if (appointmentsAtDayList.length > 0) {
            appointmentsGrid[i][j] = appointmentsAtDayList;

          }
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

  /**
   * Fills calendar grid with dates and appoinments from arrays: daysGrid and appointmentsGrid
   */
  printDaysGrid(): void {
    for (let i = 0; i < 6; i++) {
      for (let y = 0; y < 7; y++) {
        const currElement = document.getElementById('weekday_days_' + y + '_row_' + i);
        currElement.innerHTML = daysGrid[i][y];
        if (appointmentsGrid[i][y] !== 'X') {
          let entrys = 0;
          appointmentsGrid[i][y].forEach(appointment => {
            if (entrys <= 2) {
              currElement.innerHTML += '<br>' + appointment.title;
              entrys++;
            }
          });
        }
      }
    }
  }

  /**
   * Gets appointments at specified date
   * @param year
   * @param month
   * @param date
   * @returns List with appointments at specified date
   */
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

  /**
   * Loads next month of currently shown month in calendar view
   */
  nextMonth(): void {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    this.showCalendar(currentMonth, currentYear);
  }

  /**
   * Loads previous month of currently shown month in calendar view
   */
  prevMonth(): void {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    this.showCalendar(currentMonth, currentYear);
  }

  /**
   * Shows div on top of the calendar view. This div contains the appointments of the selected date.
   * This div includes interactive components that allow the user to add an appointment.
   * When an appintment is selected it can be shown (the form for creating an appointment opens, but is filled with detail regarding the selected event)
   * and deleted.
   * @param row
   * @param cell
   */
  listAppointments(row, cell) {
    if (document.getElementById("weekday_days_" + cell + "_row_" + row).classList.contains("day-not-in-month") == false) {
      selectedRow = row;
      selectedCell = cell;
      this.closeNewEntry();
      this.blurScreenAndButton();
      document.getElementById("appointments-at-day").style.display = "block";

      document.getElementById("appointments-at-day-text").innerHTML = "APPOINTMENTS AT " + months[currentMonth] + " " + daysGrid[row][cell] + " " + currentYear + ":"
      openDate = daysGrid[row][cell];

      let list = document.getElementById("appointments-at-day-content");
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }

      if (appointmentsGrid[row][cell] != "X") {
        appointmentsGrid[row][cell].sort((a, b) => parseInt(a.start.slice(11)) - parseInt(b.start.slice(11)));
        let idx = 0;
        appointmentsGrid[row][cell].forEach(appointment => {
          let text = appointment.start.slice(11) + " : " + appointment.title;
          let item = document.createElement("div");
          item.innerHTML = text;
          item.classList.add("appointments-at-day-content-entry");
          item.id = "appointments-at-day-content-entry-" + idx;
          list.appendChild(item);
          idx++;
        })

        let self = this;

        $(".appointments-at-day-content-entry").hover(function () {
          $(this).css({"background-color": "#c488e3", "cursor": 'pointer'});
        }, function () {
          $(this).css("background-color", "black");
        });

        $(".appointments-at-day-content-entry").on("click", function () {
            selectedId = parseInt(this.id.slice(34, 35));
            document.getElementById("table-select-td").innerHTML = "";
            let counter = 0;
            self.addMoreCategorys();
            this.isNewEntry = false;
            let currAppointment = appointmentsGrid[row][cell][selectedId];
            (<HTMLInputElement>document.getElementById("ftitle")).value = currAppointment.title;
            (<HTMLInputElement>document.getElementById("fstartdate")).value = currAppointment.start.slice(0, 10);
            (<HTMLInputElement>document.getElementById("fstarttime")).value = currAppointment.start.slice(11);
            (<HTMLInputElement>document.getElementById("fganztag")).checked = currAppointment.allday;
            if (!currAppointment.allday) {
              (<HTMLInputElement>document.getElementById("fenddate")).value = currAppointment.end.slice(0, 10);
              (<HTMLInputElement>document.getElementById("fendtime")).value = currAppointment.end.slice(11);
            } else {
              self.hideDateEnd();
            }
            (<HTMLInputElement>document.getElementById("fsummary")).value = currAppointment.extra;
            (<HTMLInputElement>document.getElementById("femail")).value = currAppointment.organizer;
            (<HTMLSelectElement>document.getElementById("fstatus")).selectedIndex = currAppointment.status;
            (<HTMLInputElement>document.getElementById("fhomepage")).value = currAppointment.webpage;
            (<HTMLInputElement>document.getElementById("flocation")).value = currAppointment.location;

            self.loadGroups();

            let categories: any = [];
            self.api.getEventCategories(currAppointment.id).subscribe((data) => {
              categories = data;
              if (categories.length == 1) {
                (<HTMLInputElement>document.getElementById("fcategory-0")).value = categories[0].name;
              } else {
                let doc = document.getElementById("table-select-td");
                for (let i = 1; i < categories.length; i++) {
                  let newSelect = document.createElement("select");
                  options.forEach(option => {
                    this.newOption = document.createElement("option")
                    this.newOption.text = option.name;
                    newSelect.add(this.newOption);
                  });
                  newSelect.id = "fcategory-" + i;
                  newSelect.classList.add("fcategory");
                  newSelect.value = categories[i].name;
                  doc.append(newSelect);
                }
              }
            });
            self.newEntry();
          }
        );

        $(".delete-btn").on("click", function () {
          if (confirm('Sicher löschen ?')) {
            console.log(appointmentsGrid[row][cell][selectedId].id)
            self.api.deleteEvent(appointmentsGrid[row][cell][selectedId].id).subscribe(() => {
              alert("Erfolgreich geloescht.")
            });

            self.loadAppointmentsFromDataBase();
            self.showCalendar(currentMonth, currentYear);
            self.listAppointments(row, cell);
            location.reload();
          }
        });
      }
    }
  }

  /**
   * Loads existing groups so they can be added to an appointment
   */
  loadGroups() {
    this.api.getGroups().subscribe((data) => {
      groups = data;
      let select = document.getElementById("fgroup") as HTMLSelectElement;
      for (let i = 0; i < groups.length; i++) {
        let newOption = document.createElement("option");
        newOption.text = groups[i].name;
        select.add(newOption);
      }
    })
  }

  /**
   * Closes form to create new entry.
   * User will see calendar view again.
   */
  closeNewEntry() {
    this.removeRedBorders();
    if ((<HTMLInputElement>document.getElementById("fganztag")).checked == true) {
      this.hideDateEnd();
    }
    this.resetInputFields();

    let newEntry = document.getElementById("new-entry-form");
    if (newEntry.style.display === "block") {
      newEntry.style.display = "none";
      this.removeBlurScreenAndButton();
    }
  }

  blurScreenAndButton() {
    document.getElementById("calender").classList.add("blur");
    document.getElementById("calender").style.pointerEvents = "none";
    document.getElementById("add-callender-entry").classList.add("blur");
    document.getElementById("add-callender-entry").style.pointerEvents = "none";
  }

  removeBlurScreenAndButton() {
    document.getElementById("calender").classList.remove("blur");
    document.getElementById("calender").style.pointerEvents = "";
    document.getElementById("add-callender-entry").classList.remove("blur");
    document.getElementById("add-callender-entry").style.pointerEvents = "";
  }

  resetInputFields() {
    (<HTMLInputElement>document.getElementById("ftitle")).value = "TITLE";
    (<HTMLInputElement>document.getElementById("fstartdate")).value = new Date(currentYear, currentMonth, openDate + 1).toISOString().slice(0, 10);
    (<HTMLInputElement>document.getElementById("fstarttime")).value = "";
    (<HTMLInputElement>document.getElementById("fganztag")).checked = false;
    (<HTMLInputElement>document.getElementById("fenddate")).value = "";
    (<HTMLInputElement>document.getElementById("fendtime")).value = "";
    (<HTMLInputElement>document.getElementById("fsummary")).value = "SUMMARY";
    (<HTMLInputElement>document.getElementById("femail")).value = "organizer@example.de";
    (<HTMLInputElement>document.getElementById("fstatus")).value = "Busy";
    (<HTMLInputElement>document.getElementById("fhomepage")).value = "";
    (<HTMLInputElement>document.getElementById("flocation")).value = "";
    (<HTMLElement>document.getElementById("table-select-td")).innerHTML = "";
    counter = 0;
  }

  hideDateEnd() {
    let objekt_text = document.getElementById("endDate-text").classList;
    let objekt_date = document.getElementById("endDate-date").classList;
    let objekt_time = document.getElementById("endDate-time").classList;
    if (objekt_text.contains("blur")) {
      objekt_text.remove("blur")
      objekt_date.remove("blur")
      objekt_time.remove("blur")
    } else {
      objekt_text.add("blur")
      objekt_date.add("blur")
      objekt_time.add("blur")
    }
  }

  removeRedBorders() {
    document.getElementById("ftitle").classList.remove("false-input");
    document.getElementById("fstartdate").classList.remove("false-input");
    document.getElementById("fstarttime").classList.remove("false-input");
    document.getElementById("fenddate").classList.remove("false-input");
    document.getElementById("fendtime").classList.remove("false-input");
    document.getElementById("femail").classList.remove("false-input");
  }

  /**
   * Enables user to add more than one category to an event
   */
  addMoreCategorys() {
    let doc = document.getElementById("table-select-td");
    if (doc.children.length >= options.length) {
      alert("Unmöglich mehr Kategorien anzugeben als Existieren")
    } else {
      let newSelect = document.createElement("select");
      options.forEach(option => {
        let newOption = document.createElement("option")
        newOption.text = option.name;
        newSelect.add(newOption);
      });
      newSelect.id = "fcategory-" + counter;
      counter++;
      newSelect.classList.add("fcategory");
      doc.append(newSelect);
    }
  }

  submitEntry() {
    this.removeRedBorders();

    let checked = true;
    let title = document.getElementById("ftitle") as HTMLInputElement;
    let titleValue
    if (title.value === "TITLE" || title.value === "" || title.value.length > 50) {
      title.classList.add("false-input");
      checked = false;
    } else {
      titleValue = title.value;
    }

    let sDate = document.getElementById("fstartdate") as HTMLInputElement;
    let sDateValue;
    if (sDate.value === "") {
      sDate.classList.add("false-input");
      checked = false;
    } else {
      sDateValue = sDate.value.slice(0, 10);
    }

    let checkBox = (document.getElementById("fganztag") as HTMLInputElement).checked;
    let sTime
    let eTime;
    let eDate
    let eDateValue;
    if (checkBox) {
      sTime = "00:00";
      eTime = "23:59";
      eDateValue = sDateValue;
    } else {
      sTime = (document.getElementById("fstarttime") as HTMLInputElement);
      if (sTime.value === "") {
        sTime.classList.add("false-input");
        checked = false;
      } else {
        sTime = sTime.value.slice(0, 5);
      }

      eDate = (document.getElementById("fenddate") as HTMLInputElement);
      let eDateValue
      if (eDate.value === "") {
        eDate.classList.add("false-input");
        checked = false;
      } else {
        eDateValue = eDate.value.slice(0, 10);
      }

      eTime = (document.getElementById("fendtime") as HTMLInputElement);
      if (eTime.value === "") {
        eTime.classList.add("false-input");
        checked = false;
      } else {
        eTime = eTime.value.slice(0, 5);
      }
    }

    let organizer = (document.getElementById("femail") as HTMLInputElement);
    let organizerValue;
    if (organizer.value === "" || organizer.value.length > 50) {
      organizer.classList.add("false-input");
      checked = false;
    } else {
      organizerValue = organizer.value;
    }

    let location = (document.getElementById("flocation") as HTMLInputElement);
    let locationValue;
    if (location.value.length > 50) {
      location.classList.add("false-input");
      checked = false;
    } else {
      locationValue = location.value;
    }

    let website = (document.getElementById("fhomepage") as HTMLInputElement);
    let websiteValue;
    if (website.value.length > 100) {
      website.classList.add("false-input");
      checked = false;
    } else {
      websiteValue = website.value;
    }

    let cats = [];
    let selects = document.getElementsByClassName("fcategory");

    for (var i = 0, len = selects.length; i < len; i++) {
      cats.push(options[(<HTMLSelectElement>selects[i]).selectedIndex]);
    }

    if (checked) {

      let group = (document.getElementById("fgroup") as HTMLSelectElement).value;
      group = groups.find(x => x.name === group).id;
      this.api.getUserGroup(+group).subscribe((data) => {
        data.forEach(user => {
          let entry = {
            userID: user.userID,
            title: titleValue,
            location: locationValue,
            organizer: organizerValue,
            start: sDateValue + "T" + sTime,
            end: eDateValue + "T" + eTime,
            status: (<HTMLSelectElement>document.getElementById("fstatus")).selectedIndex,
            allday: checkBox,
            webpage: websiteValue,
            categories: cats,
            extra: (<HTMLInputElement>document.getElementById("fsummary")).value
          }

          if (isNewEntry) {
            this.api.postEvent(entry).subscribe((data) => {
              alert("Event erfolgreich geadded");
              console.log(data);
            });
          } else {
            this.api.putEvent(appointmentsGrid[selectedRow][selectedCell][selectedId].id, entry).subscribe((data) => {
              alert("Event erfolgreich geupdated");
              console.log(data);
            });
          }

          window.location.reload();
          this.closeNewEntry();
          this.loadAppointmentsFromDataBase();
        })
      })
    }
  }

  /**
   * Closes view of appointments.
   * User will see calendar view again.
   */
  closeListAppointments() {
    let listAppointment = document.getElementById("appointments-at-day");
    if (listAppointment.style.display === "block") {
      listAppointment.style.display = "none";
      this.removeBlurScreenAndButton();
    }
  }

  newEntryIcon() {
    this.newEntry();
  }

  newEntry() {
    isNewEntry = true;
    this.addMoreCategorys();
    this.closeListAppointments();
    this.loadGroups();

    openDate++;

    let today = new Date(currentYear, currentMonth, openDate).toISOString().slice(0, 10);
    (<HTMLInputElement>document.getElementById("fstartdate")).value = today;

    this.blurScreenAndButton();

    document.getElementById("new-entry-form").style.display = "block";
  }

  newEntryBtn() {
    openDate = todayDate;
    this.newEntry();
  }

  loadCategorysFromDataBase() {
    this.api.getCategories().subscribe((data) => {
      console.log("Read Categories");
      console.log(data);
      data.forEach(category => {
        options.push(category);
      })
    });
  }
}
