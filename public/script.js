let today = new Date();
let todayDate = today.getDate();
let todayMonth = today.getMonth();
let todayYear = today.getFullYear();
let todayDay = today.getDay()

let currentDate = today.getDate();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let openDate = today.getDate();

let selectedId = -1;
let selectedRow = -1;
let selectedCell = -1;

let counter = 0;

let months = ["JANNUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
let options = [];
let daysGrid = [
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"]
]
let appointmentsGrid = [
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"]
]
let appointmentsList;

let isNewEntry = true;
let firstLoad = true;

window.onload = function() {
    loadCategorysFromDataBase();
    loadAppointmentsFromDataBase();
    document.getElementById("weekday" + todayDay).classList.add("weekday-today");
    let minDate = today.toISOString().slice(0, 10);
    $('#fstartdate').attr('min', minDate);
    $('#fenddate').attr('min', minDate);
}

function showCalendar(month, year) {
    let firstDay = ((new Date(year, month)).getDay());
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let daysInPrevMonth = 32 - new Date(year, month - 1, 32).getDate();
    let startDaysInPrevMonth = (32 - new Date(year, month - 1, 32).getDate()) - (firstDay - 1);
    let nextMonthReset = true;
    let prevMonthReset = true;

    document.getElementById("currMonth").innerHTML = months[month] + " " + year;

    clearGrid();

    let date = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            //Days in Prev Month
            if ((i === 0 && j < firstDay) || !prevMonthReset) {
                if (prevMonthReset) {
                    prevMonthReset = false;
                    date = startDaysInPrevMonth;
                }
                if (date < daysInPrevMonth) {
                    daysGrid[i][j] = date;
                    document.getElementById("weekday_days_" + (j) + "_row_" + (i)).classList.add("day-not-in-month");
                } else {
                    daysGrid[i][j] = date;
                    document.getElementById("weekday_days_" + (j) + "_row_" + (i)).classList.add("day-not-in-month");
                    date = 0;
                    prevMonthReset = true;
                }
                //Days in Next Month
            } else if ((date > daysInMonth) || !nextMonthReset) {
                if (nextMonthReset) {
                    nextMonthReset = false;
                    date = 1;
                }
                daysGrid[i][j] = date;
                document.getElementById("weekday_days_" + j + "_row_" + i).classList.add("day-not-in-month");
                //Days in Month
            } else {
                daysGrid[i][j] = date;
                if (year === todayYear && month === todayMonth && date === todayDate) {
                    document.getElementById("weekday_days_" + j + "_row_" + i).classList.add("day-today");
                }
                let appointmentsAtDayList = appointmentsAtDay(year, month, date);
                if (appointmentsAtDayList.length > 0) {
                    appointmentsGrid[i][j] = appointmentsAtDayList;
                }
            }
            date++;
        }
    }
    console.log("DaysGrid:");
    console.log(daysGrid);
    console.log("AppointmentsGrid:");
    console.log(appointmentsGrid);
    printDaysGrid();
}

function printDaysGrid() {
    for (i = 0; i < 6; i++) {
        for (y = 0; y < 7; y++) {
            let currElement = document.getElementById("weekday_days_" + y + "_row_" + i);
            currElement.innerHTML = daysGrid[i][y];
            if (appointmentsGrid[i][y] != "X") {
                let entrys = 0;
                appointmentsGrid[i][y].forEach(appointment => {
                    if (entrys <= 2) {
                        currElement.innerHTML += "<br>" + appointment.title.substr(0, 12);
                        entrys++;
                    }
                })
            }
        }
    }
}

function appointmentsAtDay(year, month, date) {
    let filterString = new Date(year, month, date + 1).toISOString().slice(0, 10);
    let appointmentsAtDayList = [];
    appointmentsList.forEach(appointment => {
        if (appointment.start.slice(0, 10).localeCompare(filterString) == 0) {
            appointmentsAtDayList.push(appointment);
        }
    });
    return appointmentsAtDayList;
}

function clearGrid() {
    for (i = 0; i < 6; i++) {
        for (y = 0; y < 7; y++) {
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-not-in-month");
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-today");
            daysGrid[i][y] = "X";
            appointmentsGrid[i][y] = "X";
        }
    }
}

function nextMonth() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function prevMonth() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function newEntryBtn() {
    openDate = todayDate;
    isNewEntry = true;
    addMoreCategorys();
    newEntry();
}

function newEntryIcon() {
    isNewEntry = true;
    addMoreCategorys();
    newEntry();
}

function newEntry() {
    closeListAppointments();

    let today = new Date(currentYear, currentMonth, openDate + 1).toISOString().slice(0, 10);
    document.getElementById("fstartdate").value = today;

    blurScreenAndButton();
    document.getElementById("screen").disabled = true;
    document.getElementById("new-entry-form").style.display = "block";
}

function hideDateEnd() {
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

function closeNewEntry() {
    removeRedBorders();
    if (document.getElementById("fganztag").checked == true) {
        hideDateEnd();
    }
    resetInputFields();

    let newEntry = document.getElementById("new-entry-form");
    if (newEntry.style.display === "block") {
        newEntry.style.display = "none";
        removeBlurScreenAndButton();
    }
}

function closeListAppointments() {
    let listAppointment = document.getElementById("appointments-at-day");
    if (listAppointment.style.display === "block") {
        listAppointment.style.display = "none";
        removeBlurScreenAndButton();
    }
}

function resetInputFields() {
    document.getElementById("ftitle").value = "TITLE";
    document.getElementById("fstartdate").value = new Date(currentYear, currentMonth, openDate + 1).toISOString().slice(0, 10);
    document.getElementById("fstarttime").value = ""
    document.getElementById("fganztag").checked = false;
    document.getElementById("fenddate").value = "";
    document.getElementById("fendtime").value = "";
    document.getElementById("fsummary").value = "SUMMARY";
    document.getElementById("fimg").style.background = "";
    document.getElementById("fimg").style.width = 0;
    document.getElementById("fimg").style.height = 0;
    document.getElementById("fpicture").value = "";
    document.getElementById("femail").value = "organizer@example.de";
    document.getElementById("fstatus").value = "Busy";
    document.getElementById("fhomepage").value = "";
    document.getElementById("flocation").value = "";
    document.getElementById("table-select-td").innerHTML = "";
    counter = 0;
}

function blurScreenAndButton() {
    document.getElementById("screen").classList.add("blur");
    document.getElementById("add-callender-entry").classList.add("blur");
}

function removeBlurScreenAndButton() {
    document.getElementById("screen").classList.remove("blur");
    document.getElementById("add-callender-entry").classList.remove("blur");
}

function listAppointments(row, cell) {
    if (document.getElementById("weekday_days_" + cell + "_row_" + row).classList.contains("day-not-in-month") == false){
        selectedRow = row;
        selectedCell = cell;
        closeNewEntry();
        blurScreenAndButton();
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
    
            $(".appointments-at-day-content-entry").on("click", function() {
                $(".appointments-at-day-content>div.selected").removeClass("selected");
                this.classList.add("selected");
                selectedId = parseInt(this.id.slice(34, 35));
            });
    
            $(".bi-pencil-square").on("click", function() {
                if (selectedId == -1) {
                    alert("Bitte wähle einen Termin aus!")
                } else {
                    document.getElementById("table-select-td").innerHTML = "";
                    counter = 0;
                    addMoreCategorys();
                    isNewEntry = false;
                    let currAppointment = appointmentsGrid[row][cell][selectedId];
                    document.getElementById("ftitle").value = currAppointment.title;
                    document.getElementById("fstartdate").value = currAppointment.start.slice(0, 10)
                    document.getElementById("fstarttime").value = currAppointment.start.slice(11);
                    document.getElementById("fganztag").checked = currAppointment.allday;
                    if (!currAppointment.allday) {
                        document.getElementById("fenddate").value = currAppointment.end.slice(0, 10);
                        document.getElementById("fendtime").value = currAppointment.end.slice(11);
                    } else {
                        hideDateEnd();
                    }
                    document.getElementById("fsummary").value = currAppointment.extra;
                    let docImg = document.getElementById("fimg");
                    checkImgSize(currAppointment.imageurl, docImg);
                    docImg.style.backgroundImage = "url('" + currAppointment.imageurl + "')";
                    document.getElementById("femail").value = currAppointment.organizer;
                    document.getElementById("fstatus").value = currAppointment.status;
                    document.getElementById("fhomepage").value = currAppointment.webpage;
                    document.getElementById("flocation").value = currAppointment.location;
    
                    console.log(currAppointment.categories)
                    if (currAppointment.categories.length == 1) {
                        document.getElementById("fcategory-0").value = currAppointment.categories[0].name;
                    } else {
                        let doc = document.getElementById("table-select-td");
                        for (let i = 1; i < currAppointment.categories.length; i++) {
                            let newSelect = document.createElement("select");
                            options.forEach(option => {
                                newOption = document.createElement("option")
                                newOption.text = option.name;
                                newSelect.add(newOption);
                            });
                            newSelect.id = "fcategory-" + i;
                            newSelect.classList.add("fcategory");
                            newSelect.value = currAppointment.categories[i].name;
                            doc.append(newSelect);
                        }
                    }
                    newEntry();
                }
            });
    
            $(".bi-dash-square").on("click", function() {
                if (selectedId == -1) {
                    alert("Bitte wähle einen Termin aus!");
                } else {
                    if (confirm('Sicher löschen ?')) {
                        let request = new XMLHttpRequest();
    
                        request.onreadystatechange = function() {
                            if (this.readyState == 204) {
                                alert("Erfolgreich gelöscht");
                            }
                        }
    
                        request.open("DELETE", "http://dhbw.radicalsimplicity.com/calendar/2319319/events/" + appointmentsGrid[row][cell][selectedId].id, false);
                        request.send();
    
                        loadAppointmentsFromDataBase();
                        showCalendar(currentMonth, currentYear);
                        listAppointments(row, cell);
                        location.reload();
                    }
                }
            });
        }
    }
}

function loadAppointmentsFromDataBase() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            appointmentsList = JSON.parse(this.responseText);
            console.log("Read Apponitmens:");
            console.log(appointmentsList);
        }
    }

    request.open("GET", "http://dhbw.radicalsimplicity.com/calendar/2319319/events", false);
    request.send();

    showCalendar(currentMonth, currentYear);
}

function addMoreCategorys() {
    let doc = document.getElementById("table-select-td");
    if (doc.children.length >= options.length) {
        alert("Unmöglich mehr Kategorien anzugeben als Existieren")
    } else {
        let newSelect = document.createElement("select");
        options.forEach(option => {
            newOption = document.createElement("option")
            newOption.text = option.name;
            newSelect.add(newOption);
        });
        newSelect.id = "fcategory-" + counter;
        counter++;
        newSelect.classList.add("fcategory");
        doc.append(newSelect);
    }
}

function submitEntry() {
    removeRedBorders();

    let checked = true;
    let imgUrl = null;
    var file = document.querySelector('input[type=file]')['files'][0];
    var FR = new FileReader();
    if (file != undefined) {
        FR.readAsDataURL(file);
        FR.addEventListener("load", function(e) {
            imgUrl = e.target.result;
        });
    }

    let title = document.getElementById("ftitle");
    if (title.value === "TITLE" || title.value === "" || title.value.length > 50) {
        title.classList.add("false-input");
        checked = false;
    } else {
        title = title.value;
    }

    let sDate = document.getElementById("fstartdate");
    if (sDate.value === "") {
        sDate.classList.add("false-input");
        checked = false;
    } else {
        sDate = sDate.value.slice(0, 10);
    }

    let checkBox = document.getElementById("fganztag").checked;
    let sTime
    let eTime;
    let eDate;
    if (checkBox) {
        sTime = "00:00";
        eTime = "23:59";
        eDate = sDate;
    } else {
        sTime = document.getElementById("fstarttime");
        if (sTime.value === "") {
            sTime.classList.add("false-input");
            checked = false;
        } else {
            sTime = sTime.value.slice(0, 5);
        }

        eDate = document.getElementById("fenddate");
        if (eDate.value === "") {
            eDate.classList.add("false-input");
            checked = false;
        } else {
            eDate = eDate.value.slice(0, 10);
        }

        eTime = document.getElementById("fendtime");
        if (eTime.value === "") {
            eTime.classList.add("false-input");
            checked = false;
        } else {
            eTime = eTime.value.slice(0, 5);
        }
    }

    let organizer = document.getElementById("femail");
    if (organizer.value === "" || organizer.value.length > 50) {
        organizer.classList.add("false-input");
        checked = false;
    } else {
        organizer = organizer.value;
    }

    let location = document.getElementById("flocation");
    if (location.value.length > 50) {
        location.classList.add("false-input");
        checked = false;
    } else {
        location = location.value;
    }

    let website = document.getElementById("fhomepage");
    if (website.value.length > 100) {
        website.classList.add("false-input");
        checked = false;
    } else {
        website = website.value;
    }

    let cats = [];
    let selects = document.getElementsByClassName("fcategory");
    for (var i = 0, len = selects.length; i < len; i++) {
        cats.push(options[selects[i].selectedIndex]);
    }

    if(checked) {    setTimeout(() => {
        let entry = {
            title: title,
            location: location,
            organizer: organizer,
            start: sDate + "T" + sTime,
            end: eDate + "T" + eTime,
            status: document.getElementById("fstatus").value,
            allday: checkBox,
            webpage: website,
            imagedata: imgUrl,
            categories: cats,
            extra: document.getElementById("fsummary").value
        }
    
        let request = new XMLHttpRequest();
    
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert("Event erfolgreich geadded");
                console.log(this.responseText);
                window.location.reload();
            }
        }
    
        if (isNewEntry) {
            request.open("POST", "http://dhbw.radicalsimplicity.com/calendar/2319319/events", true);
        } else {
            console.log(selectedRow, selectedCell, selectedId);
            console.log(appointmentsGrid[selectedRow][selectedCell][selectedId].id);
            request.open("PUT", "http://dhbw.radicalsimplicity.com/calendar/2319319/events/" + appointmentsGrid[selectedRow][selectedCell][selectedId].id, true);
        }
        console.log(JSON.stringify(entry));
        request.send(JSON.stringify(entry));
    
        closeNewEntry();
        loadAppointmentsFromDataBase();
    }, 300);}
}

function removeRedBorders() {
    document.getElementById("ftitle").classList.remove("false-input");
    document.getElementById("fstartdate").classList.remove("false-input");
    document.getElementById("fstarttime").classList.remove("false-input");
    document.getElementById("fenddate").classList.remove("false-input");
    document.getElementById("fendtime").classList.remove("false-input");
    document.getElementById("femail").classList.remove("false-input");
}

function loadCategorysFromDataBase() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let categories = JSON.parse(this.responseText);
            console.log("Read Categories");
            console.log(categories);
            categories.forEach(categorie => {
                options.push(categorie);
            })
        }
    }

    request.open("GET", "http://dhbw.radicalsimplicity.com/calendar/2319319/categories", true);
    request.send();
}

function addCategoryToDataBase(data) {
    let categorie = {
        name: data
    }

    let request = new XMLHttpRequest();
    request.open("POST", "http://dhbw.radicalsimplicity.com/calendar/2319319/categories", true);
    request.send(JSON.stringify(categorie));
}

function checkImgSize(imgUrl, docImg) {
    let img = new Image();
    img.src = imgUrl;
    img.onload = function() {
        if (this.height <= 200){
            docImg.style.height = this.height;
        }else {
            docImg.style.height = "200px";
        }
        if (this.width <= 440){
            docImg.style.width = this.width;
        }else {
            docImg.style.width = "440px";
        }
    };
}

$('#fpicture').change(function() {
    var file = document.querySelector('input[type=file]')['files'][0];
    let docImg = document.getElementById("fimg");
    var FR = new FileReader();
    FR.addEventListener("load", function(e) {
        let imgUrl = e.target.result;
        checkImgSize(imgUrl, docImg);
        docImg.style.backgroundImage = "url('" + imgUrl + "')";
    });
    FR.readAsDataURL(file);
});

window.onkeydown = function(event) {
    if (event.keyCode === 27) {
        closeNewEntry();
        closeListAppointments();
    }
};