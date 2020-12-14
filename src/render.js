const { desktopCapturer, remote } = require('electron');

const { writeFile } = require('fs');
var fs = require('fs');
const { dialog, Menu } = remote;
const screenshot = require('screenshot-desktop');
const axios = require('axios');

// Global state


 var login = localStorage.getItem('login');
 if(login === 'true'){
  window.location.href = 'enduserscreen-play.html';
 }
// Buttons

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  message.innerText = 'A new update is available. Downloading now...';
  notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  restartButton.classList.remove('hidden');
  notification.classList.remove('hidden');
});

function closeNotification() {
  notification.classList.add('hidden');
}
function restartApp() {
  ipcRenderer.send('restart_app');
}



const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  let data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    workspace: document.getElementById("workspace").value
  };
  console.log(data);
  axios.post('https://www.the-close.work/api/login' , data)
  .then(res => {
    console.log(res);
    if(!res.data.error){
      localStorage.setItem('login','true');
      localStorage.setItem('userDetails',JSON.stringify(res.data));
      window.location.href = 'enduserscreen-play.html';
    }
    if (res.data.error) {
      dialog.showErrorBox('Closer', res.data.error);
    }
  })
  .catch(error =>{
    console.log(error);
  });
}

