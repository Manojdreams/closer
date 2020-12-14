const { remote } = require("electron");
var win = remote.BrowserWindow.getFocusedWindow();
h3 = document.getElementById('total_time');
task = document.getElementById('task_name');
start = document.getElementById('start');
stop = document.getElementById('stop');
const axios = require('axios');
var quit = document.querySelector("#quit");
h3.textContent = localStorage.getItem('taskTime');
document.getElementById("start").onclick = startTask;
document.getElementById("stop").onclick = stopTask;
localStorage.setItem('minWindowTask',false);
timer();
// localStorage.setItem('minWindow', true);
quit.addEventListener("click", () => {
  localStorage.setItem('minWindow', false);
  console.log(win)
  var win = remote.BrowserWindow.getFocusedWindow();
  win.close();
});

$(document).keypress(function () {
console.log("i")
});

function time() {
  h3.textContent = localStorage.getItem('taskTime');  
  task.textContent = localStorage.getItem('task_name'); 
  task_run = localStorage.getItem('task_run');
  console.log($('#stop'));
  if(task_run === 'true'){
    $('#stop').show();
    $('#start').hide();
    localStorage.setItem('minWindowTask', true);
  }
  else {
    $('#stop').hide();
    $('#start').show();
    localStorage.setItem('minWindowTask', false);
  }
   timer();
}
function timer() {
  t = setTimeout(time, 1000);
}

function startTask() {
  axios.get('http://localhost:9000/task_start', { })
    .then(res => {
      console.log(res);
    });
}

function stopTask(){
  axios.get('http://localhost:9000/task_pause', { })
    .then(res => {
      console.log(res);
    });
}
