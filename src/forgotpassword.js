const { desktopCapturer, remote} = require('electron');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const path = require('path');
const { writeFile } = require('fs');
var fs = require('fs');
const { dialog, Menu } = remote;
const screenshot = require('screenshot-desktop');
const axios = require('axios');

// Global state




var login = localStorage.getItem('login');
if (login === 'true') {
  window.location.href = 'enduserscreen-play.html';
}
// Buttons
$('#form_container').show();
// $('#message_container').hide();

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  let data = {
    email: document.getElementById("email").value,
    workspace: document.getElementById("workspace").value
  };
  console.log(data);
  axios.post('https://www.the-close.work/api/app/forgot/password', data)
    .then(res => {
      console.log(res.data);
      if (res.data.success) {
        $('#form_container').hide();
        // $('#message_container').show();
        var x = document.getElementById("message");
        x.textContent = res.data.message
      }
      if (res.data.error) {
        dialog.showErrorBox('Closer', res.data.error);
      }
    });
}