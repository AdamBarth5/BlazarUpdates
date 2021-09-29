let $ = jQuery = require('jquery');
const { ipcRenderer } = require('electron')
const ipc = ipcRenderer
const simplegit = require("simple-git")
const git = simplegit(process.cwd())
const fs = require("fs")

async function checkupdate(){
  try {
    await git.pull()
  }
  catch (e) {
    try {
      fs.renameSync("backup", ".git")
      try {
        await git.fetch()
        await git.pull()
      } catch (e) {
        alert("Unable to get the latest update, contact developer")
      }
      
    } catch (e){
        alert("Not enough rights, please rename the folder 'backup' to '.git' manually")
    }
}
}

checkupdate().then(() => {
    ipc.send("main-window")
    ipc.send("quitLoad");
})

$(document).keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    ipc.send('main-window')
    ipc.send('quitLoad')
  }
});


var count = 0;
var frames = 100;
var speed = 50;

var intervalId = window.setInterval(function(){
  count = count + 1
  // console.log(count);
  if (count >= frames) {
  count = 0
  }
  $('#animPlate').attr('src','css/img/seq/seq__' + count + '.png');
}, speed);
