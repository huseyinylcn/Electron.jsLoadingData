const electron = require('electron')
const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')
const url = require('url')

function date() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime
}
function dosyaicin() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    const filename = `${year}${month}${day}`
    const dosyaYolu = `${filename}`;
    return dosyaYolu
}
//? bu Fonksiyonda yıl ay günü aldım dosya adı yıl ay gün olduğu için ve ben en yeni dosyayı okumak için günçel zamanı aldım
function firebaseicin() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    const filenamedoc = `${year}-${month}-${day}`
    return filenamedoc

}

var serviceAccount = require("./aglsistem-71590-firebase-adminsdk-olxun-a9589dc058.json");
const console = require('console')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://aglsistem-71590-default-rtdb.firebaseio.com"
});
const db = admin.firestore();

const {app,BrowserWindow,ipcMain,Menu} = electron
let mainwindow;
app.on('ready', ()=>{
mainwindow = new BrowserWindow({
    width:568,
    height:498,
 
})
mainwindow.setResizable(false)
mainwindow.loadURL(
    url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashes:true
    }))

ipcMain.on('radio',(err,data)=>{
   upd()
    db.collection('Dosya_Yol').doc(data.station)
        .set({
            radio:data.radio,
            station:data.station,
            stationpath:data.stationpath
        })
        .then(() => {
            console.log('Station is Defined')
        })
        .catch(()=>{
            console.log('Station is Undefined!!!')
        })


    const directoryPath = 'C:/Agl_istasyon_name';
    const filePath = `${directoryPath}/istasyon_name.txt`;

    if (fs.existsSync(directoryPath)) {
        writeToFile();
    } else {
        fs.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
                console.log('Station is Undefined')
                return;
            }

            writeToFile();
        });
    }

    function writeToFile() {
        fs.writeFile(filePath, data.station, { flag: 'w' }, (err) => {
            if (err) {
                console.log('Station is Undefined')
            } else {
                console.log('Station is Defined')
               
            }
        });
    }


})

// const focusedWindow = BrowserWindow.getFocusedWindow();

//     focusedWindow.webContents.openDevTools();
ipcMain.on('x', (err,data)=>{
    app.quit()
})

Menu.setApplicationMenu(null)

function upd(){

fs.readFile('C:\\Agl_istasyon_name\\istasyon_name.txt', (error, data) => {


    async function getUsers() {
    const usersRef = db.collection('Dosya_Yol').where('station', '==', data.toString());
    const snapshot = await usersRef.get()
    snapshot.forEach(doc => {
        let stationpath = doc.data().stationpath
        let station = doc.data().station
        let radio = doc.data().radio
      
        mainwindow.webContents.send('stationpath',{
            stationpath:stationpath,
            station:station,
            radio:radio

        });
        try {
        fs.watch(`${stationpath}\\${dosyaicin()}${radio}`, () => {
            let x = 0;

            let lines = []


            //? Burada okuduğumuz dosyamızın Boyutunu  alıyoruz


            const okuyucu = fs.createReadStream( `${stationpath}\\${dosyaicin()}${radio}`, { start: dosyaBoyut })


            okuyucu.on('data', (e) => {
               
                lines = e.toString().split('\n')
     
                for (let i = 0; i < lines.length; i++) {
                    var forEachveri = lines[i].replace(/\r/g, '')
                    if (forEachveri != '') {
                        if (i == x) {
                        x += 40;
                        let date = forEachveri.slice(0, 8)
                        let veri = forEachveri.slice(11, 18)
                        let newveri = parseInt(veri, 10)

                        const Date = date.replace(/:/g, '-')

                        let datefirebase = `${firebaseicin()}-${Date}`

                            console.log(newveri)
                            console.log(datefirebase)

                        db.collection(station).doc(datefirebase)
                            .set({
                                propverisi: newveri,
                                gelenzaman: datefirebase
                            })
                            .then(() => {
                                console.log('Veri gönderiliyor');
                                mainwindow.webContents.send('consol',{
                                   newveri:newveri,
                                   datefirebase:datefirebase
                        
                                });
                              
                            })

                        }//! 4 dk bir al if end
                    }//! Boş dizileri alma if End
                }//! for end

            })
            okuyucu.on('end', () => {
                dosyaBoyut += okuyucu.bytesRead

            })

        })
  
        } catch (error) {
            var hata = `Okunaçak Dosya Bulunamadı 60s sonra tekrar çalışaçak ${error}`
            console.log(hata)
           
            setTimeout( getUsers,20000)
            
        }
        fs.watch(stationpath, (eventType, filename) => {
            if (eventType === 'rename' && filename.endsWith(radio)) {
                console.log(`Yeni dosya oluşturuldu: ${filename}`);
                getUsers()
            }
        });

        let dosyaBoyut = fs.statSync(`${stationpath}\\${dosyaicin()}${radio}`).size
            




    })
    
    }



   getUsers()
    })
}
upd()
})

