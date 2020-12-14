var h1 = document.getElementById('timer'),
  h2 = document.getElementById('totaltime'),
  total_time_content = '',
  addTask = document.getElementById('add_task'),
  logout = document.getElementById('logout'),
  start = document.getElementById('start'),
  stop = document.getElementById('stop'),
  clear = document.getElementById('clear'),
  seconds = 0, minutes = 0, hours = 0,
  countseconds = 0, countminutes = 0, counthours = 0,
  permanentTaskDiv = document.getElementById('permanent_tasks'),
  currentTaskDiv = document.getElementById('current_tasks'),
  completedTaskDiv = document.getElementById('completed_tasks'),
  project_title = document.getElementById('project_title'),
  permanent_tasks = [],
  taskseconds = 0, taskminutes = 0, taskhours = 0,
  permanent_count = document.getElementById('permanent_count'),
  profile_image = document.getElementById('profile_image'),
  workspace = document.getElementById('workspace'),
  current_count = document.getElementById('current_count'),
  completed_count = document.getElementById('completed_count'),
  user_name = document.getElementById('user_name'),
  clearCompleted = document.getElementById('clearCompleted'),
  startAgain = document.getElementById('startAgain'),
  popupText = document.getElementById('popupText'),
  popupCircle = document.getElementById('popupCircle'),
  startAgain = document.getElementById('startAgain'),
  closePopup = document.getElementById('closePopup'),
  sidemenuUrl = {},
  reportSubmenu = false,
  settingsSubmenu = false,
  t,
  timeout,
  keyCount = 0,
  mouseCount = 0,
  screenshotTimeout,
  work_log_id = 0,
  selectedTaskid = 0;
  projectDetails = [],
  selected_menu = 'current',
  perm_task_run = false,
  curr_task_run = false;
  currentTasks = [];
  taskTimeoutStart = false;
  taskDetails = [],
  completedTaskList = [],
  overallTasks = [];
  selectedProjectId = 0;
selectedProjectTaskId = 0;
var userDetails;
const axios = require('axios');
const { writeFile } = require('fs');
var fs = require('fs');
var shell = require('shell');
const { remote } = require('electron');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const { dialog, Menu } = remote;
const { ipcRenderer } = require('electron');
const screenshot = require('screenshot-desktop');
var win = remote.BrowserWindow.getFocusedWindow();
const { webContents } = require('electron');
const path = require('path');
const express = require('express');
const expressApp = express();
const bodyParser = require('body-parser');
port = 9000;
let menubar = false;
const { spawn } = require('child_process');
var moment = require('moment');
// const { dialog } = require('electron').remote
let bat;
var keypress = require('keypress');
keypress(process.stdin);
const { screen } = remote;
let offlineScreenshots = [];
let offlineWeblogs = [];
const ioHook = require('iohook');
var countDownDate;
var taskcountDownDate;
var seconds2=0;
var minutes2= 34;
var taskseconds2 = 0;
var taskminutes2 = 0;
countTimeout = undefined;
pythoncodeStart = 0;
var timeoutID;
console.log(electron.screen);
console.log(screen.getCursorScreenPoint());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

expressApp.listen(port, function () {
  //console.log(expressApp);
});

expressApp.post("/", function (req, res) {
console.log(req.body);
  let webData = req.body;
  if (localStorage.getItem('task_run') === 'true') {
    for (data of webData) {
      var data = {
        type: 'APP',
        name: data.name,
        usage_time: data.time_spent,
        work_logs_id: work_log_id,
        start_time: data.start_time,
        end_time: data.end_time,
      };
      if(navigator.onLine){
        if (data.name != '') {
          var header = { 'Authorization': 'Bearer ' + userDetails.token }
          //console.log(data);
          axios.post('https://www.the-close.work/api/user/webapp/usage', data, { headers: header })
            .then(res => {
            // console.log(res)
            })
        }
      }
      else{
        offlineWeblogs.push(data)
      }
    }
  }
  res.send({ message: 'success' });

});

expressApp.get("/task_pause/", function (req, res) {
  //console.log(req.body);
  if (perm_task_run) {
    permenatTaskPause(selectedTaskid);
  }
  if (curr_task_run) {
    taskPause(selectedTaskid);
  }

  res.send({ message: 'success' });
});

expressApp.get("/task_start/", function (req, res) {
  //console.log(req.body);

  if (selectedTaskid === 0) {
    taskStart(overallTasks[0].id);
  }
  else {
    if (localStorage.getItem('task_tab') === 'permenant') {
      permenatTaskStart(selectedTaskid);
    }
    if (localStorage.getItem('task_tab') === 'current') {
      taskStart(selectedTaskid);
    }
  }
  res.send({ message: 'success' });
});

localStorage.setItem("task_run", false);

let mainWindow1 = new BrowserWindow({
  width: 300,
  height: 30,
  webPreferences: {
    nodeIntegration: true,
    // devTools: false
  },
  alwaysOnTop: true,
  minimizable: false,
  maximizable: false,
  autoHideMenuBar: true,
  minHeight: 50,
  minWidth: 200,
  maxHeight: 50,
  // maxWidth: 580,
  useContentSize:true,
  transparent: true,
  frame: false,
});
// and load the index.html of the app.
mainWindow1.loadFile(path.join(__dirname, 'task-playing.html'));
// localStorage.setItem('minWindow', true);
// mainWindow1.webContents.openDevTools();
mainWindow1.on('close', function () {
  showMenuBar();
})



function hideMenuBar() {
  menubar = true;
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Activity Bar',
          submenu: [
            {
              label: 'Hide Menu bar',
              click: function () {
                mainWindow1.close();
                showMenuBar();
              }
            },
          ]
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function showMenuBar() {
                 menubar = false;
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Activity Bar',
          submenu: [
            {
              label: 'Show Menu bar',
              click: function () {
                mainWindow1 = new BrowserWindow({
                  width: 300,
                  height: 30,
                  webPreferences: {
                    nodeIntegration: true,
                    devTools: false
                  },
                  alwaysOnTop: true,
                  minimizable: false,
                  maximizable: false,
                  autoHideMenuBar: true,
                  minHeight: 40,
                  minWidth: 200,
                  maxHeight: 30,
                  // maxWidth: 580,
                  transparent: true,
                  useContentSize: true,
                  frame: false,
                });
                // and load the index.html of the app.
                mainWindow1.loadFile(path.join(__dirname, 'task-playing.html'));
                hideMenuBar();
                mainWindow1.on('close', function () {
                  showMenuBar();
                  // menubar = false;
                })
              }
            },
          ]
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

hideMenuBar();

localStorage.getItem('task_run', false);
localStorage.setItem('minWindowTask', false);
userDetails = JSON.parse(localStorage.getItem('userDetails'));
user_name.textContent = userDetails.user.user_details[0].first_name + ' ' + userDetails.user.user_details[0].last_name;
workspace.textContent = userDetails.user.company.name;
profile_image.src = userDetails.user.company.image_path;

console.log(userDetails);

// if (userDetails.user.company_settings[2].enabled){
// // console.log('web app enabled');
//   bat.stdout.on('data', (data) => {
//   // console.log(data.toString());
//   });
//   bat.stderr.on('data', (data) => {
//     console.error(data.toString());
//   });
// }

$('#stop').hide();
$('#clearCompleted').hide();
$('.loader1').hide();

$('#start').show();

logout.onclick = function () {
  localStorage.clear();
  // console.log(menubar)
  if(menubar){
      mainWindow1.close();
  }

  // localStorage.setItem('userDetails', JSON.stringify(res.data));
  window.location.href = 'index.html';
}

loadTasks();
$(window).on('load', function () {
  $(".loader").fadeOut("slow");
});

const alertOnlineStatus = () => {
  if(navigator.onLine){
    postOfflineScreenshots();
    postOfflineWeblogs()
  }
}


function postOfflineScreenshots(){
  if(offlineScreenshots.length != 0){
    let a = 0;
    offlineScreenshots.forEach((key,index) => {
      a++;
      axios.post('https://www.the-close.work/api/user/screenshots', key, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + userDetails.token
        }
      })
        .then(res => {
        // console.log(res)
          if (res.data.success === true) {
            if (a === offlineScreenshots.length) {
              offlineScreenshots = [];
            }
          }
        })
    })
  }
}

function postOfflineWeblogs() {
  if (offlineWeblogs.length != 0) {
    let a = 0;
    offlineWeblogs.forEach((key, index) => {
      a++;
      var header = { 'Authorization': 'Bearer ' + userDetails.token }
      //console.log(data);
      axios.post('https://www.the-close.work/api/user/webapp/usage', key, { headers: header })
        .then(res => {
        // console.log(res)
          if (a === offlineWeblogs.length) {
          // console.log('in')
            offlineWeblogs = [];
          }
        })
    })
  }
}






window.addEventListener('online', alertOnlineStatus)
window.addEventListener('offline', alertOnlineStatus)

alertOnlineStatus();
gettime();

function loadTasks() {
  var header = { 'Authorization': 'Bearer ' + userDetails.token };
  //console.log(header);
  axios.post('https://www.the-close.work/api/user/projects', {}, { headers: header })
    .then(res => {
    console.log(res);
      userDetails.user = res.data.user;
      // localStorage.setItem('userDetails', JSON.stringify(res.data));
      // if (userDetails.user.company_settings[2].enabled===1) {
      // // console.log('web app enabled');
      //   bat.stdout.on('data', (data) => {
      //   // console.log(data.toString());
      //   });
      //   bat.stderr.on('data', (data) => {
      //     console.error(data.toString());
      //   });
      // }
      
      var x = document.getElementById("projectSelect").selectedIndex;
      // if (x === 0) {
        projectDetails = res.data.user.user_details[0].user_project;
        permanent_tasks = res.data.user.permanent_tasks;
        permanent_count.textContent = permanent_tasks.length;
        overallTasks = res.data.user.user_details[0].user_task;
        currentTasks = res.data.user.user_details[0].user_task;
        sidemenuUrl = res.data.user.menu;
        user_name.textContent = res.data.user.user_details[0].first_name + ' ' + userDetails.user.user_details[0].last_name;
        workspace.textContent = res.data.user.company.name;
        profile_image.src = res.data.user.company.image_path;
        // aTags = document.getElementsByTagName("a");
        // for (var i = 0; i < aTags.length; i++) {
        //   aTags[i].setAttribute("onclick", "require('electron').shell.openExternal('" + aTags[i].href + "')")
        // }
      
        $('#permanentContainer').hide();
        $('#projectContainer').hide();
        $('#container').show();
        $('#completedContainer').hide();
      // console.log(currentTasks);
        let today_total_hours = res.data.user.today_total_hours;
        let total_hours = today_total_hours.split(':');
        total_time_content = today_total_hours;
        hours = parseInt(total_hours[0]);
        minutes = parseInt(total_hours[1]);
        seconds = parseInt(total_hours[2]);
        h1.textContent = today_total_hours;
        localStorage.setItem('taskTime', (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00"));
        h2.textContent = today_total_hours;
        var str = "";
        document.getElementById("project_list").innerHTML = "";
        var projectHTML = '';
        for (var item of projectDetails) {
          console.log(item);
          str += "<option value = " + item.id + ">" + item.name + "</option>";
          item.task = [];
          for (var task of overallTasks) {
            if (task.project_id === item.id) {
              task.project_name = item.name;
              item.task.push(task);
            }
          }
          for (var task of currentTasks) {
            if (task.project_id === item.id) {
              task.project_name = item.name;
            }
          }

          let taskLength = item.task.length;
          projectHTML = `<li>
            <a onClick="projectTasks(${item.id})">
              <span class="menu-img">
                <img src="assets/img/icons/folder-1.png" alt="">
                      </span>
                <span class="menu-text">${item.name}</span>
                <span class="badge">${taskLength}</span>
                    </a>
                  </li>`;
          document.getElementById('project_list').insertAdjacentHTML('beforeend', projectHTML);
        }

        //console.log(projectHTML);
        var x = document.getElementById("projectSelect").selectedIndex;
      console.log(x, document.getElementsByTagName("option"));
        document.getElementsByTagName("option")[x].value = projectDetails[0].id;
      console.log(x, document.getElementsByTagName("option")[0]);
      $('.selectpicker').html(str);
      $('.selectpicker').selectpicker('refresh');
      $('.selectpicker').selectpicker('val', [projectDetails[selectedProjectId].id]);
        // document.getElementById("projectSelect").innerHTML = ;
        myFunction();
        permenantTaskDivHtml();
        completeTaskList();
        if (overallTasks.length != 0) {
          localStorage.setItem("task_name", overallTasks[0].name);
        }
      if (userDetails.user.user_details[0].permanent_task === 0) {
        $('#permenant').remove();
      }
      // }
      // else {
      //   projectDetails = res.data.user.user_details[0].user_project;
      //   permanent_tasks = res.data.user.permanent_tasks;
      //   permanent_count.textContent = permanent_tasks.length;
      //   overallTasks = res.data.user.user_details[0].user_task;
      //   currentTasks = res.data.user.user_details[0].user_task;
      //   if (overallTasks.length != 0) {
      //     localStorage.setItem("task_name", overallTasks[0].name);
      //   }
      //   // let today_total_hours = res.data.user.today_total_hours;
      //   myFunction();
      // }

    })
    .catch(error => {
      mainWindow1.close();
      // localStorage.clear();
      // window.location.href = 'index.html';
    console.log(error)
    })
}

ioHook.on("keypress", event => {
  // console.log(event);
  keyCount++;
  if (localStorage.getItem('task_run') === 'true') {
    // console.log(event);
    resetTimer(event);
  }
  // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
});
ioHook.on("mousemove", event => {
  mouseCount++;
  // console.log(mouseCount);
  if (localStorage.getItem('task_run') === 'true') {
    // console.log(event);
    resetTimer(event);
  }
  // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
});
ioHook.start();

$('#edit_time').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl["Edit Time"];
// console.log(link)
  require("electron").shell.openExternal(link);
});


$('#settings').on('click', (event) => {
  if (!settingsSubmenu) {
    $('#settings_submenu').show();
    settingsSubmenu = true;
  }
  else if (settingsSubmenu) {
    $('#settings_submenu').hide();
    settingsSubmenu = false;
  }
});

$('#invite_team').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl["Invite Your Team"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#payments').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl["Billing"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#reports').on('click', (event) => {
  if (!reportSubmenu) {
    $('#reports_submenu').show();
    reportSubmenu = true;
  }
  else if (reportSubmenu) {
    $('#reports_submenu').hide();
    reportSubmenu = false;
  }
});

$('#timesheet').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Reports.Timesheet;
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#projects').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Reports["Projects"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#attendance').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Reports["Attendance"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#poorTimeUse').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Reports["Poor Time Use"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#webUsage').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Reports["Web & App Usage"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#timeuse').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Reports["Time Use"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#userSetting').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Settings["User Settings"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#companySetting').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Settings["Company Settings"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#manageUser').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Settings["Manage Users"];
// console.log(link)
  require("electron").shell.openExternal(link);
});

$('#projects_permanent_task').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl.Settings["Project & Permanent Task"];
// console.log(link)
  require("electron").shell.openExternal(link);
});


$('#screenshots').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl["Screenshots"];
// console.log(link)
  require("electron").shell.openExternal(link);
});
$('#dashboard').on('click', (event) => {
// console.log(event)
  event.preventDefault();
  let link = sidemenuUrl["Dashboard"];
// console.log(link)
  require("electron").shell.openExternal(link);
});


function loadProject() {
  completedTaskList = [];
  var header = { 'Authorization': 'Bearer ' + userDetails.token };
  //console.log(header);
  axios.post('https://www.the-close.work/api/user/projects', {}, { headers: header })
    .then(res => {
    // console.log(res);
      userDetails.user = res.data.user;
      // localStorage.setItem('userDetails', JSON.stringify(res.data));
      projectDetails = res.data.user.user_details[0].user_project;
      permanent_tasks = res.data.user.permanent_tasks;
      permanent_count.textContent = permanent_tasks.length;
      overallTasks = res.data.user.user_details[0].user_task;
      currentTasks = res.data.user.user_details[0].user_task;
      currentTasks.forEach((item) => {
        if (item.status_id === 1) {
          //console.log(item);
          completedTaskList.push(item);
        }
      })

      var str = "";
      document.getElementById("project_list").innerHTML = "";
      var projectHTML = '';
      for (var item of projectDetails) {
        console.log(item);
        str += "<option value = " + item.id + ">" + item.name + "</option>";
        item.task = [];
        for (var task of overallTasks) {
          if (task.project_id === item.id) {
            task.project_name = item.name;
            item.task.push(task);
          }
        }
        for (var task of currentTasks) {
          if (task.project_id === item.id) {
            task.project_name = item.name;
          }
        }

        let taskLength = item.task.length;
        projectHTML = `<li>
            <a onClick="projectTasks(${item.id})">
              <span class="menu-img">
                <img src="assets/img/icons/folder-1.png" alt="">
                      </span>
                <span class="menu-text">${item.name}</span>
                <span class="badge">${taskLength}</span>
                    </a>
                  </li>`;
        document.getElementById('project_list').insertAdjacentHTML('beforeend', projectHTML);
      }

      completedTaskDivHtml();
      completed_count.textContent = completedTaskList.length;
      console.log(overallTasks);
      if (completedTaskList.length !== 0) {
        $('#clearCompleted').show();
      }
      else {
        $('#clearCompleted').hide();
      }

    })
    .catch(error => {
      // localStorage.clear();
      // window.location.href = 'index.html';
    console.log(error)
    })
}


function add() {

  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance =now - countDownDate;

  // Time calculations for days, hours, minutes and seconds
  // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours1 = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes1 = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));;
   var seconds1 = Math.floor((distance % (1000 * 60)) / 1000);
  // console.log(seconds,seconds1,seconds2);
   if (seconds2<60){
    seconds2 = seconds+seconds1;
  }
  // console.log(seconds, seconds1, seconds2);
  if (minutes2 < 60) {
    minutes2 = minutes+ minutes1;
  }

  if (seconds2 >= 60) {
    seconds2 = seconds2-60;
    minutes2++;
    if (minutes2 >= 60) {
      minutes2 = minutes2-60;
      minutes = 0;
      countDownDate = new Date().getTime();
      hours++;
    }
  }

  total_time_content = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes2 ? (minutes2 > 9 ? minutes2 : "0" + minutes2) : "00") + ":" + (seconds2 > 9 ? seconds2 : "0" + seconds2);
  // console.log(total_time_content);
  h2.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + "h " + (minutes2 ? (minutes2 > 9 ? minutes2 : "0" + minutes2) : "00") + "m";
  localStorage.setItem('taskTime', (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes2 ? (minutes2 > 9 ? minutes2 : "0" + minutes2) : "00"));
  localStorage.setItem("task_run", true);
  // Output the result in an element with id="demo"
  // document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  //   + minutes + "m " + seconds + "s ";

  // seconds++;
  // if (seconds >= 60) {
  //   seconds = 0;
  //   minutes++;
  //   if (minutes >= 60) {
  //     minutes = 0;
  //     hours++;
  //   }
  // }
  // total_time_content = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
  // h2.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + "h " + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + "m";
  // localStorage.setItem('taskTime', (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00"));
  // localStorage.setItem("task_run", true);
  timer();
}
function timer() {
  t = setTimeout(add, 1000);
}

function taskTimer1() {
// console.log(selectedTaskid);
  var taskDiv = document.getElementById(`task_${selectedTaskid}`);

  //console.log(taskDiv)

  // taskseconds++;
  // if (taskseconds >= 60) {
  //   taskseconds = 0;
  //   taskminutes++;
  //   if (taskminutes >= 60) {
  //     taskminutes = 0;
  //     taskhours++;
  //   }
  // }

  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = now - taskcountDownDate;

  // Time calculations for days, hours, minutes and seconds
  // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var taskhours1 = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var taskminutes1 = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var taskseconds1 = Math.floor((distance % (1000 * 60)) / 1000);

  if (taskseconds2 < 60) {
    taskseconds2 = taskseconds + taskseconds1;
  }

  if (taskminutes2 < 60) {
    taskminutes2 = taskminutes + taskminutes1;
  }

  if (taskseconds2 >= 60) {
    taskseconds2 = taskseconds2 - 60;
    taskminutes2++;
    if (taskminutes2 >= 60) {
      taskminutes2 = taskminutes2 - 60;
      taskminutes = 0;
      taskcountDownDate = new Date().getTime();
      taskhours++;
    }
  }
  //console.log(`task_${selectedTaskid}`);
  if (taskDiv != null){
    taskDiv.textContent = (taskhours ? (taskhours > 9 ? taskhours : "0" + taskhours) : "00") + ":" + (taskminutes2 ? (taskminutes2 > 9 ? taskminutes2 : "0" + taskminutes2) : "00") + ":" + (taskseconds2 > 9 ? taskseconds2 : "0" + taskseconds2);
    tasktimer();
  }
 
  if (perm_task_run) {
    permanent_tasks.forEach((item) => {
      //console.log(overallTasks, item.id, selectedTaskid);
      if (item.id === selectedTaskid) {
        //console.log(item.id);
        item.worked_hours = (taskhours ? (taskhours > 9 ? taskhours : "0" + taskhours) : "00") + ":" + (taskminutes2 ? (taskminutes2 > 9 ? taskminutes2 : "0" + taskminutes2) : "00") + ":" + (taskseconds2 > 9 ? taskseconds2 : "0" + taskseconds2);
        h1.textContent = (taskhours ? (taskhours > 9 ? taskhours : "0" + taskhours) : "00") + ":" + (taskminutes2 ? (taskminutes2 > 9 ? taskminutes2 : "0" + taskminutes2) : "00") + ":" + (taskseconds2 > 9 ? taskseconds2 : "0" + taskseconds2);
        localStorage.setItem("task_name", item.name);
        // project_title.textContent = item.name;
      }
    })
  }
  if (curr_task_run) {
    overallTasks.forEach((item) => {
      //console.log(overallTasks, item.id, selectedTaskid);
      if (item.id === selectedTaskid) {
        //console.log(item.id);
        item.worked_hours = (taskhours ? (taskhours > 9 ? taskhours : "0" + taskhours) : "00") + ":" + (taskminutes2 ? (taskminutes2 > 9 ? taskminutes2 : "0" + taskminutes2) : "00") + ":" + (taskseconds2 > 9 ? taskseconds2 : "0" + taskseconds2);
        h1.textContent = (taskhours ? (taskhours > 9 ? taskhours : "0" + taskhours) : "00") + ":" + (taskminutes2 ? (taskminutes2 > 9 ? taskminutes2 : "0" + taskminutes2) : "00") + ":" + (taskseconds2 > 9 ? taskseconds2 : "0" + taskseconds2);
        localStorage.setItem("task_name", item.name);
        // project_title.textContent = item.name;
      }
    })
  }
}

window.setInterval(function () { // Set interval for checking
  var date = new Date(); // Create a Date object to find out what time it is
  var now = moment();
  // console.log(date.getHours(), date.getMinutes(), date.getSeconds() );
  if (localStorage.getItem('task_run') === 'true') {
  if (date.getHours() === 23 && date.getMinutes() === 59 && date.getSeconds() ===58) { // Check the time
      var id = selectedTaskid;
      document.getElementById("container").innerHTML = "";
      var strHTML = '';
      $('#stop').hide();
      $('#start').show();
      var punchOutTime = now.endOf('day').utc().format('Y-MM-DD HH:mm:ss');
      var x = document.getElementById("projectSelect").selectedIndex;
      var header = { 'Authorization': 'Bearer ' + userDetails.token }
      var data = {
        work_log_type: 'Computer',
        task_id: id,
        punch_in: '',
        punch_out: punchOutTime
      };
      //console.log(header);
      axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
        .then(res => {
          work_log_id = 0;
          console.log(bat.pid);
          //console.log(res);
        })
      clearTimeout(t);
      clearTimeout(screenshotTimeout);
      clearTimeout(taskTimeout);
      overallTasks.forEach(function (item) {
        // console.log(overallTasks);
        // console.log((id === item.id), !item.playing);
        if ((id === item.id) && !item.playing) {
          item.playing = true;
          strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-pause" id="starttask" onClick="taskPause(${item.id})">
                    <i class="fas fa-pause"></i>
                  </a>
                </div>
              </div>`;
        }
        else {
          // console.log(item)
          item.playing = false;
          strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="taskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
        }
      })
      document.getElementById('container').insertAdjacentHTML('beforeend', strHTML);
      //console.log(id);
      overallTasks.forEach(function (item) {
        if (item.status_id === 1) {
          document.getElementById(`checkbox_${item.id}`).checked = true;
        }
      })
  }
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) { // Check the time
      id = selectedTaskid;
      if (perm_task_run) {
        permenatTaskPause(selectedTaskid);
      }
      selectedTaskid = id;
      document.getElementById("container").innerHTML = "";
      var strHTML = '';
      $('#stop').show();
      $('#start').hide();
      //console.log("img");
      countDownDate = new Date().getTime();
      taskcountDownDate = new Date().getTime();
      var punchInTime = now.startOf('day').utc().format('Y-MM-DD HH:mm:ss');
      var x = document.getElementById("projectSelect").selectedIndex;
      var header = { 'Authorization': 'Bearer ' + userDetails.token }
      var data = {
        work_log_type: 'Computer',
        task_id: id,
        punch_in: punchInTime,
        punch_out: ''
      };
      console.log(data);
      localStorage.setItem('task_id', id);
      localStorage.setItem('token', userDetails.token);
      axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
        .then(res => {
          work_log_id = res.data.work_logs_id;
          curr_task_run = true;
          perm_task_run = false;
          //console.log(res);
          if (pythoncodeStart === 0) {
            console.log(pythoncodeStart);
            pythoncodeStart = 1;
            if (userDetails.user.company_settings[2].enabled === 1) {
              // console.log('web app enabled');
              bat = spawn('src\\activewindow\\activewindow.exe');
              bat.stdout.on('data', (data) => {
                // console.log(data.toString());
              });
              bat.stderr.on('data', (data) => {
                console.error(data.toString());
              });
            }
          }

          localStorage.setItem('task_tab', 'current');
        });
      overallTasks.forEach(function (item) {
        // console.log(item);
        if ((id === item.id) && !item.playing) {
          item.playing = true;
          strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                  <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                 <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-pause" id="starttask" onClick="taskPause(${item.id})">
                    <i class="fas fa-pause"></i>
                  </a>
                </div>
              </div>`;
          let task_hours = item.worked_hours.split(':');
          taskhours = parseInt(task_hours[0]);
          taskminutes = parseInt(task_hours[1]);
          taskseconds = parseInt(task_hours[2]);
          let today_total_hours = total_time_content;
          // console.log(today_total_hours);
          let total_hours = today_total_hours.split(':');
          hours = parseInt(total_hours[0]);
          minutes = parseInt(total_hours[1]);
          seconds = parseInt(total_hours[2]);
        }
        else {
          item.playing = false;
          strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                  <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="taskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
        }
      })
      document.getElementById('container').insertAdjacentHTML('beforeend', strHTML);
      selectedTaskid = id;
      // //console.log(taskTimeout);  
      if (taskTimeoutStart) {
        clearTimeout(taskTimeout);
        clearTimeout(t);
        clearTimeout(screenshotTimeout);
      }
      timer();
      screenshotTimer();
      tasktimer();

      overallTasks.forEach(function (item) {
        if (item.status_id === 1) {
          document.getElementById(`checkbox_${item.id}`).checked = true;
        }
      })
    }
  }
}, 1000); // Repeat every 60000 milliseconds (1 minute)

function completeTaskList() {
  completedTaskList = [];
  currentTasks.forEach((item) => {
    if (item.status_id === 1) {
      //console.log(item);
      completedTaskList.push(item);
      completedTaskDivHtml();
    }
  })
  completed_count.textContent = completedTaskList.length;

  if (completedTaskList.length !== 0) {
    $('#clearCompleted').show();
  }
  else {
    $('#clearCompleted').hide();
  }

}

function getServerTime(){
  var header = { 'Authorization': 'Bearer ' + userDetails.token };
  //console.log(header);
  axios.post('https://www.the-close.work/api/user/projects', {},  { headers: header })
    .then(res => {
     console.log(res);
      projectDetails = res.data.user.user_details[0].user_project;
      // permanent_tasks = res.data.user.permanent_tasks;
      // permanent_count.textContent = permanent_tasks.length;
      // overallTasks = res.data.user.user_details[0].user_task;
      // currentTasks = res.data.user.user_details[0].user_task;
      userDetails.user = res.data.user;
      let total_hours = res.data.user.today_total_hours.split(':');
      hours = parseInt(total_hours[0]);
      minutes = parseInt(total_hours[1]);
      seconds = parseInt(total_hours[2]);
      let task_hours = res.data.user.current_task_total_hours.split(':');
      taskhours = parseInt(task_hours[0]);
      taskminutes = parseInt(task_hours[1]);
      taskseconds = parseInt(task_hours[2]);
      console.log(res.data.today_worked_hours);
      console.log(h1);
      console.log(h1.textContent);
      h1.textContent = res.data.user.current_task_total_hours;
      h2.textContent = res.data.user.today_total_hours;
      console.log(res.data.today_worked_hours);
      console.log(h1);
      console.log(h1.textContent);
      taskcountDownDate = new Date().getTime();
      countDownDate = new Date().getTime();
      var str = "";
      document.getElementById("project_list").innerHTML = "";
      var projectHTML = '';
      for (var item of projectDetails) {
        console.log(item);
        str += "<option value = " + item.id + ">" + item.name + "</option>";
        item.task = [];
        for (var task of overallTasks) {
          if (task.project_id === item.id) {
            task.project_name = item.name;
            item.task.push(task);
          }
        }
        for (var task of currentTasks) {
          if (task.project_id === item.id) {
            task.project_name = item.name;
          }
        }

        let taskLength = item.task.length;
        projectHTML = `<li>
            <a onClick="projectTasks(${item.id})">
              <span class="menu-img">
                <img src="assets/img/icons/folder-1.png" alt="">
                      </span>
                <span class="menu-text">${item.name}</span>
                <span class="badge">${taskLength}</span>
                    </a>
                  </li>`;
        document.getElementById('project_list').insertAdjacentHTML('beforeend', projectHTML);
      }

      //console.log(projectHTML);
      var x = document.getElementById("projectSelect").selectedIndex;
      console.log(x, document.getElementsByTagName("option"));
      document.getElementsByTagName("option")[x].value = projectDetails[0].id;
      console.log(x, document.getElementsByTagName("option")[0]);
      $('.selectpicker').html(str);
      $('.selectpicker').selectpicker('refresh');
      $('.selectpicker').selectpicker('val', [projectDetails[selectedProjectId].id]);
        // document.getElementById("projectSelect").innerHTML = ;
      gettime();

    })
    .catch(error => {
      console.log(error);
      gettime();
    })
}

function gettime() {
  getServerTimeout = setTimeout(getServerTime, 300000);
}


function tasktimer() {
  taskTimeout = setTimeout(taskTimer1, 1000);
  taskTimeoutStart = true;
}

function screenshotTimer() {
  if ((userDetails.user.user_details[0].screenshots === 1) && (userDetails.user.company_settings[0].enabled === 1)) {
  // console.log('screenshot enabled');
    if ((userDetails.user.company_settings[1].enabled === 1)){
    // console.log('screenshot interval enabled');
      if (userDetails.user.user_details[0].screenshots_interval === 0) {
        var min = 5,
          max = 8;
        var rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
      // console.log('Wait for ' + rand + ' minitues');
        screenshotTimeout = setTimeout(takeScreenshot, rand * 60000);
      }
      else {
      // console.log('Wait for ' + userDetails.user.user_details[0].screenshots_interval + ' minitues');
        screenshotTimeout = setTimeout(takeScreenshot, userDetails.user.user_details[0].screenshots_interval * 60000);
      }
    }
    else {
      var min = 5,
        max = 8;
      var rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
    // console.log('Wait for ' + rand + ' minitues');
      screenshotTimeout = setTimeout(takeScreenshot, rand * 60000);
    }
  }
}

async function takeScreenshot() {
  //console.log((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
  //console.log(timeout);

  var dateTime = moment().utc().format('Y-MM-DD HH:mm:ss');
  //console.log(keyCount);
  screenshot().then((img) => {
    var path = 'C:\\Windows\\Temp\\' + (hours ? (hours > 9 ? hours : "0" + hours) : "00") + "-" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + "-" + (seconds > 9 ? seconds : "0" + seconds) + 'screenshot.png';
    fs.writeFile(path, img, function (err) {
    // console.log(err)
      var filepath = path;
      // var filepath = "../"+path;
      convertRelativeUriToFile(filepath, 'screenShot', null, (file) => {
      // console.log(file)
        let key = (keyCount / 0.02) / 100;
        let mouse = (mouseCount / 2) / 100;
        var formData = new FormData();
        var screenShotTime = moment().utc().format('Y-MM-DD HH:mm:ss');
        formData.append("image", file);
        formData.append("work_logs_id", work_log_id);
        formData.append("click_count", mouse);
        formData.append("key_count", key);
        formData.append("shot_time", screenShotTime);
        if(navigator.onLine){
          axios.post('https://www.the-close.work/api/user/screenshots', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer ' + userDetails.token
            }
          })
            .then(res => {
            // console.log(res)
              if (res.data.success === true) {
                mouseCount = 0;
                keyCount = 0;
                fs.unlink(path, (err) => {
                  if (err) {
                    console.error(err)
                    return
                  }
                });
              }
            })
        }
        else{
          offlineScreenshots.push(formData);
        }
      })
    });
  }).catch((err) => {
  // console.log(err)
  })
  screenshotTimer();
}

async function convertRelativeUriToFile(filePath, fileName, mimeType, cb) {
  mimeType = mimeType || `image/${filePath.split('.')[filePath.split('.').length - 1]}`;
  const imageUrl = await fetch(filePath);
  const buffer = await imageUrl.arrayBuffer();
  cb(new File([buffer], fileName, { type: mimeType }));
}

addTask.onclick = function () {
  //console.log("click");
  $(".loader1").show();
  var x = document.getElementById("projectSelect").selectedIndex;
  var id = parseInt(document.getElementsByTagName("option")[x].value);
  var header = { 'Authorization': 'Bearer ' + userDetails.token }
  var data = {
    project_id: id,
    task_name: document.getElementById("new_task").value,
    task_id: '',
    status: ''
  };
  //console.log(data);
  axios.post('https://www.the-close.work/api/user/add/task', data, { headers: header })
    .then(res => {
    // console.log(res);
      loadTasks();
      if (res.data.success === true) {
      // console.log(res);
        document.getElementById("new_task").value = '';
        loadTasks();
        // loadProject();
      }
      if (res.data.error) {
        // document.getElementById("new_task").value = '';
        dialog.showErrorBox('Closer',res.data.error);(res.data.error);
      }
      $(".loader1").fadeOut('slow');
    })
    .catch(error => {
      // document.getElementById("new_task").value = '';
      $(".loader1").fadeOut('slow');
    })
}

clearCompleted.onclick = function () {
  let selected = false;
  completedTaskList.forEach((task) => {
    if (task.id === selectedTaskid) {
      console.log(selected);
      taskPause(selectedTaskid);
      selected = true;
    }
  })
  $(".loader").show();
  var header = { 'Authorization': 'Bearer ' + userDetails.token }
  var data = {
  };
  //console.log(data);
  axios.post('https://www.the-close.work/api/clear/all/completed/tasks', data, { headers: header })
    .then(res => {
      //console.log(res);
      if (res.status === 200) {
        userDetails.user = res.data.user;
        //console.log("test");
        console.log(res);
        completedTaskList = [];
        projectDetails = res.data.user.user_details[0].user_project;
        permanent_tasks = res.data.user.permanent_tasks;
        permanent_count.textContent = permanent_tasks.length;
        overallTasks = res.data.user.user_details[0].user_task;
        currentTasks = res.data.user.user_details[0].user_task;
        current_count.textContent = overallTasks.length;
      // console.log(currentTasks);
        currentTasks.forEach((item) => {
          if (item.status_id === 1) {
          // console.log(item);
            completedTaskList.push(item);
          }
        })
        for (var item of projectDetails) {
          item.task = [];
          for (var task of overallTasks) {
            if (task.project_id === item.id) {
              task.project_name = item.name;
              item.task.push(task);
            }
          }
          for (var task of currentTasks) {
            if (task.project_id === item.id) {
              task.project_name = item.name;
            }
          }
        }
        
       loadProject();
        completedTaskDivHtml();
        completed_count.textContent = completedTaskList.length;
        //console.log(completedTaskList.length);
        if (completedTaskList.length !== 0) {
        // console.log(currentTasks);
          $('#clearCompleted').show();
        }
        else {
        // console.log(currentTasks);
          $('#clearCompleted').hide();
        }
        if (!selected && (localStorage.getItem('task_run') === 'true')) {
          console.log(selected, selectedTaskid);
          taskStart(selectedTaskid);
        }
        else{
          console.log(selected, selectedTaskid);
          myFunction();
        }
      }
      // loadTasks();
      $(".loader").fadeOut('slow');
    })
}

function completeTask(id, name, projectId) {
  var checked = document.getElementById(`checkbox_${id}`).checked;
  //console.log(checked);
  // document.getElementById(`checkbox_${id}`).checked = false;
  if (checked) {
    var header = { 'Authorization': 'Bearer ' + userDetails.token }
    var data = {
      project_id: projectId,
      task_name: name,
      task_id: id,
      status: 'completed'
    };
    //console.log(data);
    axios.post('https://www.the-close.work/api/user/add/task', data, { headers: header })
      .then(res => {
        //console.log(res);
        if (res.data.status === true) {
          //console.log("test");
        }
        loadProject();
        // completeTaskList();

      })
  }
  if (!checked) {
    var header = { 'Authorization': 'Bearer ' + userDetails.token }
    var data = {
      project_id: projectId,
      task_name: name,
      task_id: id,
      status: 'incomplete'
    };
    //console.log(data);
    axios.post('https://www.the-close.work/api/user/add/task', data, { headers: header })
      .then(res => {
        //console.log(res);
        if (res.data.status === true) {
          //console.log("test");
        }
        loadProject();
        // completeTaskList();
      })
  }
}

function completeDivTask(id, name, projectId) {
  var checked = document.getElementById(`complete_${id}`).checked;
  //console.log(checked);
  // document.getElementById(`checkbox_${id}`).checked = false;
  if (checked) {
    var header = { 'Authorization': 'Bearer ' + userDetails.token }
    var data = {
      project_id: projectId,
      task_name: name,
      task_id: id,
      status: 'completed'
    };
    //console.log(data);
    axios.post('https://www.the-close.work/api/user/add/task', data, { headers: header })
      .then(res => {
        //console.log(res);
        if (res.data.status === true) {
          //console.log("test");
        }
        loadProject();
        // completeTaskList();

      })
  }
  if (!checked) {
    var header = { 'Authorization': 'Bearer ' + userDetails.token }
    var data = {
      project_id: projectId,
      task_name: name,
      task_id: id,
      status: 'incomplete'
    };
    //console.log(data);
    axios.post('https://www.the-close.work/api/user/add/task', data, { headers: header })
      .then(res => {
        //console.log(res);
        if (res.data.status === true) {
          //console.log("test");
        }
        loadProject();
        // completeTaskList();
      })
  }
}

completedTaskDiv.onclick = function () {
  selected_menu = 'completed'
  activateCurrentPage($('#nav li'));
  $('#completedContainer').show();
  $('#permanentContainer').hide();
  $('#container').hide();
  $('#projectContainer').hide();

}


function completedTaskDivHtml() {
  //console.log(completedTaskList);
  document.getElementById("completedContainer").innerHTML = "";
  var strHTML = '';
  completedTaskList.forEach(function (item) {
    strHTML += `<div class="task-list">
              <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="completeDivTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='complete_${item.id}'>
                    <label class="custom-control-label" for="complete_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-pencil" aria-hidden="true"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                </div>
              </div>`;
  })
  document.getElementById('completedContainer').insertAdjacentHTML('beforeend', strHTML);
  completedTaskList.forEach(function (item) {
    //console.log(completedTaskList);
    if (item.status_id === 1) {
      document.getElementById(`complete_${item.id}`).checked = true;
    }
  })
}



permanentTaskDiv.onclick = function () {
  selected_menu = 'permanent'
  activateCurrentPage($('#nav li'));
  $('#permanentContainer').show();
  $('#container').hide();
  $('#completedContainer').hide();
  $('#projectContainer').hide();
}


$('body').tooltip({
  selector: '.tooltip-div'
});

function permenantTaskDivHtml() {
// console.log(userDetails.user.user_details[0].permanent_task);
  if (userDetails.user.user_details[0].permanent_task === 0) {
  // console.log(userDetails.user.user_details[0].permanent_task)
    $('#nav #permanent').remove();
  }else{
    document.getElementById("permanentContainer").innerHTML = "";
    var strHTML = '';
    permanent_tasks.forEach(function (item) {
      strHTML += `<div class="task-list">
              
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                 <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="permenatTaskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
    })
    document.getElementById('permanentContainer').insertAdjacentHTML('beforeend', strHTML);
    permanent_tasks.forEach(function (item) {
      if (item.status_id === 1) {
        document.getElementById(`checkbox_${item.id}`).checked = true;
      }
    })
  }
  
}

currentTaskDiv.onclick = function () {
  selected_menu = 'current'
  activateCurrentPage($('#nav li'));
  $('#permanentContainer').hide();
  $('#container').show();
  $('#completedContainer').hide();
  $('#projectContainer').hide();
  overallTasks = currentTasks;

  // myFunction();
}

start.onclick = function () {
  // $('#stop').show();
  // $('#start').hide();
  // //console.log("img");
  // var punchInTime = moment().format('Y-MM-DD HH:mm:ss');
  // var x = document.getElementById("projectSelect").selectedIndex;
  // var header = { 'Authorization': 'Bearer ' + userDetails.token }
  // var data = {
  //   work_log_type: 'Computer',
  //   task_id: ,
  //   punch_in: punchInTime,
  //   punch_out: ''
  // };
  // //console.log(header);
  // axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
  //   .then(res => {
  //     work_log_id = res.data.work_logs_id
  //     //console.log(res);
  //   })
  // timer();
  // screenshotTimer();
  if (selectedTaskid === 0) {
    taskStart(overallTasks[0].id);
  }
  else {
    if (perm_task_run) {
      permenatTaskStart(selectedTaskid);
    }
    if (curr_task_run) {
      taskStart(selectedTaskid);
    }
  }

}
// 

function changeProject(){
  var x = document.getElementById("projectSelect").selectedIndex;
  var id = parseInt(document.getElementsByTagName("option")[x].value);
  
  selectedProjectId = x-1;
  console.log(x, selectedProjectId,id);
}

function myFunction() {
  console.log(document.getElementById("projectSelect").selectedIndex);
  var x = document.getElementById("projectSelect").selectedIndex;
  console.log(x);
  console.log(document.getElementsByTagName("option"));
  var id = parseInt(document.getElementsByTagName("option")[x].value);
  taskDetails = [];
      console.log(overallTasks);
  for (var item of overallTasks) {
    //console.log(item, document.getElementsByTagName("option")[x].value);
    //console.log(item.project_id === id);
    if (item.project_id === id) {
      taskDetails.push(item);
      //console.log(taskDetails);
    }
  }
  current_count.textContent = currentTasks.length;
  document.getElementById("container").innerHTML = "";
  var strHTML = '';
  overallTasks.forEach(function (item) {
    strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="completeTask(${item.id},'${item.name}',${item.project_id})\" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                 
                    <div class="text-truncate">
                     <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
               
                <div class="task-actions">
                <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                  <i class="fas fa-pencil" aria-hidden="true"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="taskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
  })
  document.getElementById('container').insertAdjacentHTML('beforeend', strHTML);


  overallTasks.forEach(function (item) {
    if (item.status_id === 1) {
      document.getElementById(`checkbox_${item.id}`).checked = true;
    }
  })

}

function projectTasks(id) {
  //console.log("test" , id);
  selected_menu = 'current'
  $('#projectContainer').show();
  activateCurrentPage($('#nav li'));
  $('#permanentContainer').hide();
  $('#container').hide();
  $('#completedContainer').hide();
  overallTasks = currentTasks;
  projectTaskDiv(id);
  selectedProjectTaskId = id;
}

function projectTaskDiv(id) {
  taskDetails = [];
  for (var item of overallTasks) {
    if (item.project_id === id) {
      taskDetails.push(item);
    }
  }
  current_count.textContent = overallTasks.length;
  document.getElementById("projectContainer").innerHTML = "";
  var strHTML = '';
  taskDetails.forEach(function (item) {
    console.log(item.playing);
    if (!item.playing){
      strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='project_checkbox_${item.id}'>
                    <label class="custom-control-label" for="project_checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="taskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
    } else{
      strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                  <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='project_checkbox_${item.id}'>
                    <label class="custom-control-label" for="project_checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                 <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-pause" id="starttask" onClick="taskPause(${item.id})">
                    <i class="fas fa-pause"></i>
                  </a>
                </div>
              </div>`;
    }
  
  })
  document.getElementById('projectContainer').insertAdjacentHTML('beforeend', strHTML);

  taskDetails.forEach(function (item) {
    if (item.status_id === 1) {
      document.getElementById(`project_checkbox_${item.id}`).checked = true;
    }
  })
}

function taskStart(id) {
console.log(overallTasks, selectedTaskid);
  getServerTime();
  if (perm_task_run) {
    permenatTaskPause(selectedTaskid);
  }
  selectedTaskid = id;
  document.getElementById("container").innerHTML = "";
  var strHTML = '';
  $('#stop').show();
  $('#start').hide();
  //console.log("img");
  countDownDate = new Date().getTime();
  taskcountDownDate = new Date().getTime();
  var punchInTime = moment().utc().format('Y-MM-DD HH:mm:ss');
  var x = document.getElementById("projectSelect").selectedIndex;
  var header = { 'Authorization': 'Bearer ' + userDetails.token }
  var data = {
    work_log_type: 'Computer',
    task_id: id,
    punch_in: punchInTime,
    punch_out: ''
  };
  console.log(data);
  localStorage.setItem('task_id',id);
  localStorage.setItem('token', userDetails.token);
  axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
    .then(res => {
      work_log_id = res.data.work_logs_id;
      curr_task_run = true;
      perm_task_run = false;
      //console.log(res);
      if(pythoncodeStart === 0){
        console.log(pythoncodeStart);
        pythoncodeStart = 1;
        if (userDetails.user.company_settings[2].enabled === 1) {
          // console.log('web app enabled');
          bat = spawn('src\\activewindow\\activewindow.exe');
          bat.stdout.on('data', (data) => {
            // console.log(data.toString());
          });
          bat.stderr.on('data', (data) => {
            console.error(data.toString());
          });
        }
      }
      
      localStorage.setItem('task_tab', 'current');
    });
  overallTasks.forEach(function (item) {
  // console.log(item);
    if ((id === item.id) && !item.playing) {
      item.playing = true;
      strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                  <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                 <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-pause" id="starttask" onClick="taskPause(${item.id})">
                    <i class="fas fa-pause"></i>
                  </a>
                </div>
              </div>`;
      let task_hours = item.worked_hours.split(':');
      taskhours = parseInt(task_hours[0]);
      taskminutes = parseInt(task_hours[1]);
      taskseconds = parseInt(task_hours[2]);
      let today_total_hours = total_time_content;
    // console.log(today_total_hours);
      let total_hours = today_total_hours.split(':');
      hours = parseInt(total_hours[0]);
      minutes = parseInt(total_hours[1]);
      seconds = parseInt(total_hours[2]);
    }
    else {
      item.playing = false;
      strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                  <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="taskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
    }
  })
  document.getElementById('container').insertAdjacentHTML('beforeend', strHTML);
  selectedTaskid = id;
  // //console.log(taskTimeout);  
  if (taskTimeoutStart) {
    clearTimeout(taskTimeout);
    clearTimeout(t);
    clearTimeout(screenshotTimeout);
  }
  timer();
  screenshotTimer();
  tasktimer();
  projectTaskDiv(selectedProjectTaskId);
  overallTasks.forEach(function (item) {
    if (item.status_id === 1) {
      document.getElementById(`checkbox_${item.id}`).checked = true;
    }
  })
}
function taskPause(id) {
  getServerTime();
  document.getElementById("container").innerHTML = "";
  var strHTML = '';
  $('#stop').hide();
  $('#start').show();
  var punchOutTime = moment().utc().format('Y-MM-DD HH:mm:ss');
  var x = document.getElementById("projectSelect").selectedIndex;
  var header = { 'Authorization': 'Bearer ' + userDetails.token }
  var data = {
    work_log_type: 'Computer',
    task_id: id,
    punch_in: '',
    punch_out: punchOutTime
  };
  //console.log(header);
  axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
    .then(res => {
      work_log_id = 0;
      console.log(bat.pid);
      //console.log(res);
    })
  clearTimeout(t);
  clearTimeout(screenshotTimeout);
  clearTimeout(taskTimeout);
  localStorage.setItem("task_run", false);
  overallTasks.forEach(function (item) {
  // console.log(overallTasks);
  // console.log((id === item.id), !item.playing);
    if ((id === item.id) && !item.playing) {
      item.playing = true;
      strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-pause" id="starttask" onClick="taskPause(${item.id})">
                    <i class="fas fa-pause"></i>
                  </a>
                </div>
              </div>`;
    }
    else {
    // console.log(item)
      item.playing = false;
      strHTML += `<div class="task-list">
                <div class="task-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" onClick="  completeTask(${item.id},'${item.name}',${item.project_id})" class="custom-control-input" id='checkbox_${item.id}'>
                    <label class="custom-control-label" for="checkbox_${item.id}"></label>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="taskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
    }
  })
  document.getElementById('container').insertAdjacentHTML('beforeend', strHTML);
  //console.log(id);
  projectTaskDiv(selectedProjectTaskId);
  overallTasks.forEach(function (item) {
    if (item.status_id === 1) {
      document.getElementById(`checkbox_${item.id}`).checked = true;
    }
  })
 
}





function permenatTaskStart(id) {
  if (curr_task_run) {
    taskPause(selectedTaskid);
  }
  selectedTaskid = id;
  document.getElementById("permanentContainer").innerHTML = "";
  var strHTML = '';
  $('#stop').show();
  $('#start').hide();
  //console.log("img");
  var punchInTime = moment().utc().format('Y-MM-DD HH:mm:ss');
  var x = document.getElementById("projectSelect").selectedIndex;
  var header = { 'Authorization': 'Bearer ' + userDetails.token }
  var data = {
    work_log_type: 'Computer',
    task_id: id,
    punch_in: punchInTime,
    punch_out: ''
  };
  //console.log(data);
  axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
    .then(res => {
      work_log_id = res.data.work_logs_id;
      perm_task_run = true;
      curr_task_run = false;
      localStorage.setItem('task_tab', 'permenant');
      //console.log(res);
    });
  permanent_tasks.forEach(function (item) {
    if ((id === item.id) && !item.playing) {
      item.playing = true;
      strHTML += `<div class="task-list">
              
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                 <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-pause" id="starttask" onClick="permenatTaskPause(${item.id})">
                    <i class="fas fa-pause"></i>
                  </a>
                </div>
              </div>`;
      let task_hours = item.worked_hours.split(':');
      taskhours = parseInt(task_hours[0]);
      taskminutes = parseInt(task_hours[1]);
      taskseconds = parseInt(task_hours[2]);
      let today_total_hours = total_time_content;
      // console.log(today_total_hours);
      let total_hours = today_total_hours.split(':');
      hours = parseInt(total_hours[0]);
      minutes = parseInt(total_hours[1]);
      seconds = parseInt(total_hours[2]);
    }
    else {
      item.playing = false;
      strHTML += `<div class="task-list">
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                 <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                  <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="permenatTaskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
    }
  })
  document.getElementById('permanentContainer').insertAdjacentHTML('beforeend', strHTML);
  selectedTaskid = id;
  // //console.log(taskTimeout);  
  if (taskTimeoutStart) {
    clearTimeout(taskTimeout);
    clearTimeout(t);
    clearTimeout(screenshotTimeout);
  }
  timer();
  screenshotTimer();
  tasktimer();
  permanent_tasks.forEach(function (item) {
    if (item.status_id === 1) {
      document.getElementById(`checkbox_${item.id}`).checked = true;
    }
  })
}
function permenatTaskPause(id) {
  document.getElementById("permanentContainer").innerHTML = "";
  var strHTML = '';
  $('#stop').hide();
  $('#start').show();
  var punchOutTime = moment().utc().format('Y-MM-DD HH:mm:ss');
  var x = document.getElementById("projectSelect").selectedIndex;
  var header = { 'Authorization': 'Bearer ' + userDetails.token }
  var data = {
    work_log_type: 'Computer',
    task_id: id,
    punch_in: '',
    punch_out: punchOutTime
  };
  //console.log(header);
  axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
    .then(res => {

      work_log_id = 0;
      //console.log(res);
    })
  clearTimeout(t);
  clearTimeout(screenshotTimeout);
  clearTimeout(taskTimeout);
  localStorage.setItem("task_run", false);
  permanent_tasks.forEach(function (item) {
    if ((id === item.id) && !item.playing) {
      item.playing = true;
      strHTML += `<div class="task-list">
               
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                  <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-pause" id="starttask" onClick="permenatTaskPause(${item.id})">
                    <i class="fas fa-pause"></i>
                  </a>
                </div>
              </div>`;
    }
    else {
      item.playing = false;
      strHTML += `<div class="task-list">
               
                <div class="task-content">
                  <div class="task-content-inner">
                    <div class="text-truncate">
                                         <div class="project-name text-muted">${item.project_name}</div>
                    ${item.name}
                    </div>
                  </div>
                </div>
                <div class="task-actions">
                 <i class="fas fa-info-circle d-inline-block mr-2 tooltip-div" data-toggle="tooltip" title="" data-original-title="${item.project_name}"></i>
                 <span class="task-timer"><time id='task_${item.id}'>${item.worked_hours}</time></span>
                  <a class="task-btn task-play" id="starttask" onClick="permenatTaskStart(${item.id})">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>`;
    }
  })
  document.getElementById('permanentContainer').insertAdjacentHTML('beforeend', strHTML);
  //console.log(id);
  permanent_tasks.forEach(function (item) {
    if (item.status_id === 1) {
      document.getElementById(`checkbox_${item.id}`).checked = true;
    }
  })
}
/* Start button */
// start.onclick = timer;

/* Stop button */
stop.onclick = function () {
  taskPause(selectedTaskid);
}



function setup() {
  startTimer();
}


  setup();

function startTimer() {

  if (timeoutID) {
    clearTimeout(timeoutID);
    timeoutID = null;
  }
  // wait 2 seconds before calling goInactive
  // console.log(timeoutID)
  if (userDetails.user.user_details[0].still_working !== 0) {
    //  console.log(timeoutID)
  // console.log(userDetails.user.user_details[0].still_working * 60000);
    timeoutID = window.setTimeout(goInactive, userDetails.user.user_details[0].still_working * 60000);
  }
  else{
    console.log(timeoutID, userDetails.user.user_details[0].still_working)
    timeoutID = window.setTimeout(goInactive, 10 * 60000);
  }
}

function goInactive() {
  console.log("testasa")
  if (localStorage.getItem('task_run') === 'true') {
    //console.log("test")

    $("#still_working").modal('show');


    // var win = remote.BrowserWindow.getFocusedWindow();
  // console.log(remote.BrowserWindow.getAllWindows());
    let window;
    remote.BrowserWindow.getAllWindows().forEach((getWindow, index) => {
      if (remote.BrowserWindow.getAllWindows().length > 1 && index === 1) {
        getWindow.setAlwaysOnTop(true);
        getWindow.maximize();
        window = getWindow;
      }
      else if (remote.BrowserWindow.getAllWindows().length === 1) {
        getWindow.setAlwaysOnTop(true);
        getWindow.maximize();
        window = getWindow;
      }
    })
    window.setAlwaysOnTop(false);
    function fancyTimeFormat(time) {
      // Hours, minutes and seconds
      const hrs = ~~(time / 3600);
      const mins = ~~((time % 3600) / 60);
      const secs = ~~time % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      let ret = "";

      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    }
    const countdownNumberEl = document.getElementById("countdown-number");
    const circle = document.getElementsByClassName("countdown-circle")[0];
    const countdown = 60;
    let newcountdown = countdown;
    const maxoffset = 2 * Math.PI * 100;
    let offset = 0;
    countdownNumberEl.textContent = fancyTimeFormat(countdown);

    tick = setInterval(function () {
      newcountdown = --newcountdown <= 0 ? 0 : newcountdown;
      if (offset - maxoffset / countdown >= -Math.abs(maxoffset)) {
        offset = offset - maxoffset / countdown;
      } else {
        offset = -Math.abs(maxoffset);
       $('#popupCircle').hide();
        taskPause(selectedTaskid);
       startAgain.textContent = 'Start Working Again';
        closePopup.textContent = "I'm on Break";
        popupText.textContent = 'Hi, It seems kind of quiet on your end... are you working?';
        countseconds = 0; countminutes = 0; counthours = 0;
        CountTimer();
      // console.log(newcountdown);
      // console.log(countdown);
        clearInterval(tick);
      }

      countdownNumberEl.textContent = fancyTimeFormat(newcountdown);
      circle.setAttribute("style", "stroke-dashoffset:" + offset + "px");
    }, 1000);
  }
}
function resetTimer(e) {
  // console.log(e)
  window.clearTimeout(timeoutID);

  active();
  // goActive();

}

function popupClear() {
  // clearTimeout(timeoutID);
  clearInterval(tick);
}

function active() {
  // console.log('e')
  startTimer();
}


function goActive() {
  // do something
  const countdownNumberEl = document.getElementById("countdown-number");
  const circle = document.getElementsByClassName("countdown-circle")[0];
  countdownNumberEl.textContent = '';
  $("#still_working").modal('hide');
  startTimer();
  if (localStorage.getItem('task_run') === 'true') {

  }
else{
    if (selectedTaskid === 0) {
      taskStart(overallTasks[0].id);
    }
    else {
      if (perm_task_run) {
        permenatTaskStart(selectedTaskid);
      }
      if (curr_task_run) {
        taskStart(selectedTaskid);
      }
    }
}

  clearInterval(tick);
  startTimer();
}

checkminWindow();

function taskChecking() {
  if (localStorage.getItem('task_run') !== localStorage.getItem('minWindowTask')) {
    if (localStorage.getItem('minWindowTask') === 'true') {

      if (selectedTaskid === 0) {
        taskStart(overallTasks[0].id);
      }
      else {
        if (perm_task_run) {
          permenatTaskStart(selectedTaskid);
        }
        if (curr_task_run) {
          taskStart(selectedTaskid);
        }
      }
    }
    else {
      // taskPause(selectedTaskid);
    }
  }
}
function checkminWindow() {
  taskcheck = setTimeout(taskChecking, 300000);
}


$('#startAgain').click(() => {
  console.log(timeoutID)
  // clearTimeout(timeoutID);
  console.log(timeoutID)
  $('#popupCircle').show();
  startAgain.textContent = 'Yes';
  closePopup.textContent = "No";
  popupText.textContent = 'Are you still working?';
  if(countTimeout != undefined){
     console.log(timeoutID)
    clearTimeout(countTimeout);
  }
  // console.log(timeoutID)
  goActive();
})


function activateCurrentPage(menuItems) {
  menuItems.each(function () {
    var $this = $(this);
    if ($this.attr('id') === selected_menu) {
      $this.addClass('active');
    }
    else {
      $this.removeClass('active');
    }
  });
}

function addCount() {
  countseconds++;
  const countdownNumberEl = document.getElementById("countdown-number");
  if (countseconds >= 60) {
    countseconds = 0;
    countminutes++;
    if (countminutes >= 60) {
      countminutes = 0;
      counthours++;
    }
  }
 if(counthours>= 1){
   countdownNumberEl.textContent = (counthours ? (counthours > 9 ? counthours : "0" + counthours) : "00") + ":" + (countminutes ? (countminutes > 9 ? countminutes : "0" + minutes) : "00") + ":" + (countseconds > 9 ? countseconds : "0" + countseconds);
 } else {
   countdownNumberEl.textContent = (countminutes ? (countminutes > 9 ? countminutes : "0" + countminutes) : "00") + ":" + (countseconds > 9 ? countseconds : "0" + countseconds);
 }
  CountTimer();
}
function CountTimer() {
  countTimeout = setTimeout(addCount, 1000);
}

activateCurrentPage($('#nav li'));

