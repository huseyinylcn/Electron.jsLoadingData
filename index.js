const electron = require('electron')
const {ipcRenderer} = electron
let radios = document.getElementsByName('uz')
var x =   document.getElementById("x")
var data =   document.getElementById("data")

var btn = document.getElementById('btn')
var station = document.getElementById('station')
const stationpath = document.getElementById('stationpath');
const stationpathinfo = document.getElementById('station-path-info');
const station_info = document.getElementById('station-info');
const station_extension_info = document.getElementById('station-extension-info');





function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const timeString = `${hours}:${minutes}:${seconds}`;
     document.getElementById("date").textContent = timeString;
     console.log(timeString)
  }
  setInterval(updateTime, 1000);

function radio(){
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          var selected_value = radios[i].value;
          return selected_value
   
        }
      }

}


btn.addEventListener('click', (event)=>{

    const statpath = stationpath.files[0].path;
    const formattedFilePath = statpath.replace(/\\/g, "\\\\");
    
    console.log(formattedFilePath)
ipcRenderer.send('radio',{
    radio:radio(),
    station:station.value,
    stationpath:formattedFilePath,
 
})
    
})

x.addEventListener('click', ()=>{
    ipcRenderer.send('x')
})


    ipcRenderer.on('stationpath', (err,data)=>{
        stationpathinfo.innerText = data.stationpath
        station_info.innerText = data.station
        station_extension_info.innerText = data.radio

       
    })
let array2=[];
let array = [];
    ipcRenderer.on('consol',(err,dat)=>{
        var newveri= dat.newveri
        var datefirebase= dat.datefirebase
       array.push(newveri)
       array2.push(datefirebase)

       if (array.length > 5) {
        array.shift();
    }
    if (array2.length > 5) {
        array2.shift();
    }
    var html = "";
    for(var i = 0; i < 5; i++){
        if (i >= array.length) break;
        html += `<p>Uploading => ${array[array.length - 1 - i]} => ${array2[array2.length - 1 - i]}</p>`;
    }
    data.innerHTML = html;
   
    

    })

