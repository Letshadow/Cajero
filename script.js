//Autenticacion Google
//AIzaSyBzwfUT71gZzBVA7R-Y7Wwg2gt5Npn6mAs
//ID CLIENTE 1006596615028-9osv2cjqqrkhrk43tcd1si4rm1hfqecq.apps.googleusercontent.com

/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
let Main=document.getElementById("Maindiv");
Main.style.visibility="hidden";
let AUser
const CLIENT_ID = '1006596615028-9osv2cjqqrkhrk43tcd1si4rm1hfqecq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBzwfUT71gZzBVA7R-Y7Wwg2gt5Npn6mAs';
const SPREADSHEET="1umEoPkQO0HX3mkkpFL63wOk96PRLkGIeCqfROpvQNwo";
const Hoja = "Usuarios";
const Rango="!A:H";
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
let SignInBt=document.getElementById("SignInBt");
let SignOutBt=document.getElementById("SignOutBt");
let content=document.getElementById("content");

let tokenClient;
let gapiInited = false;
let gisInited = false;

//USERS
let InUser=document.getElementById("InputU1");
let InPass=document.getElementById("InputU2");


//swFAce
const eyeOpenL =
"M60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30Z";
const eyeOpenR =
"M208 31C208 47.5685 194.569 61 178 61C161.431 61 148 47.5685 148 31C148 14.4315 161.431 1 178 1C194.569 1 208 14.4315 208 31Z";
const eyeClosedL =
"M60 0.000190258C60 16.5687 46.5685 30.0002 30 30.0002C13.4315 30.0002 0 16.5687 0 0.000190258C0 0.000190258 13.4315 5.5 30 5.5C46.5685 5.5 60 0.000190258 60 0.000190258Z";
const eyeClosedR =
"M208 0.999969C208 17.5685 194.569 31 178 31C161.431 31 148 17.5685 148 0.999969C148 0.999969 161.431 9.00001 178 9.00001C194.569 9.00001 208 0.999969 208 0.999969Z";
const mouthOpen =
"M77 60H130V73.5C130 88.1355 118.136 100 103.5 100C88.8645 100 77 88.1355 77 73.5V60Z";
const mouthClosed =
"M77 30H130V30.3375C130 30.7034 118.136 31 103.5 31C88.8645 31 77 30.7034 77 30.3375V30Z";
const closedEyeLeft = document.querySelector(".eye-left");
const closedEyeRight = document.querySelector(".eye-right");
const closedMouth = document.querySelector(".mouth");
const face = document.querySelector(".innerSwitch");
const switchBG = document.querySelector(".switch-background");
const background = document.querySelector("body");
let switched = false;

/*Inicializar Variables*/

let SaldoACBTN=document.getElementById("SaldoACBTN");
let AbonarV=document.getElementById("InputUA2");
let AboBt=document.getElementById("AboBt");
let DebitarV=document.getElementById("InputUA3");
let CategoriaV=document.getElementById("InputUA4");
let DebBt=document.getElementById("DebBt");
let BDUsuarios;
let IdC;
let IdCR;
let myCanvas=document.getElementById("myChart");
let xValues = ["Italy", "France", "Spain", "USA"];
let yValues = [25, 25, 25, 25];
let barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9"];
const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const myChart = new Chart(myCanvas, {
    type: "pie",
    data: {
    labels: xValues,
    datasets: [
        {
            backgroundColor: Object.values(CHART_COLORS),
            data: yValues,
        },
    ],
    },
    options: {
        title: {
            display: true,
            text: `Ultimos Gastos (Total: 100)`,
        },
    },
});

let Htable = document.getElementById("Htable");/*Historico*/
let datenow= new Date();
let AHis=[
            {Fecha:new Date().getTime(),valor:1,Categoria:"Disponible"},
            {Fecha:new Date().getTime(),valor:2,Categoria:"Disponible"},
            {Fecha:new Date().getTime(),valor:3,Categoria:"Otros"},
            {Fecha:new Date().getTime(),valor:4,Categoria:"Otros"}
        ];

/// AUTENTICACION GOOGLE

SignInBt.style.visibility = 'hidden';
SignOutBt.style.visibility = 'hidden';

SignInBt.addEventListener("click",handleAuthClick);
SignOutBt.addEventListener("click",handleSignoutClick);


/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('SignInBt').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('SignOutBt').style.visibility = 'visible';
        document.getElementById('SignInBt').innerText = 'Reload';
        await listMajors();
        Main.style.visibility="visible";
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        content.innerText = '';
        SignInBt.innerText = 'GO';
        SignOutBt.style.visibility = 'hidden';

        if (switched) {
            face.click();
        }
        Main.style.visibility="hidden";
    }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET,
            range: Hoja + Rango,
        });
    } catch (err) {
        console.warn(err.message);
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        console.warn("No hay valores en la Base de Datos")
        return;
    }
    // Flatten to string to display
    const output = range.values.reduce(
        (str, row) => `${str}|${row[0]}|${row[1]}|${row[2]}|${row[3]}|${row[4]}|${row[5]}|${row[6]}|${row[7]}\n`,
        'Usuario, Saldo:\n');
        content.innerText = output;

    BDUsuarios = {};
    IdC={};
    IdCR={};
    let NewUser;
    
    range.values.forEach((fila) => {
        if (fila[0]=="User"){
            
            fila.forEach((col,i)=>{
                IdC[col]=String.fromCharCode(i+65);
                IdCR[IdC[col]]=col;
            })
            return; 
        }else{
            let regex = /([A-ZA]+)|(\d+)/g;
            NewUser = {};
            let aux=[];
            let Historicoaux=[];
            fila.forEach((col,i)=>{
                if (i>0) {
                    NewUser[Object.keys(IdC)[i]]=col;
                }
            })           
            fila[2].split(',').forEach((tran,i)=>{                
                aux=tran.match(regex);
                Historicoaux.push({Fecha:aux[2],valor:aux[1],Categoria:IdCR[aux[0]]})
            })
            NewUser[Object.keys(IdC)[2]]=Historicoaux;
            BDUsuarios[fila[0]]=NewUser;
        }
    });    
}

async function transaccion(User,...data) {

    let LUsuarios=Object.keys(BDUsuarios);
    let LAtributos=Object.keys(BDUsuarios[User]);
    datenow=new Date();
    let response;
    let Historicoaux=""
    BDUsuarios[User].Historico.forEach((tran)=>{       
        Historicoaux+=`${IdC[tran.Categoria]}${tran.valor}@${tran.Fecha},`
    })
    Historicoaux=Historicoaux.slice(0, -1);
        
    if (data.length==1){
        const filaAEditar =  LUsuarios.indexOf(User) + 2;
        const UpdateHistorico =  [`${Historicoaux},${IdC["Disponible"]}${(data-BDUsuarios[User]["Disponible"])}@${datenow.getTime()}`];

        response1 = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET,
            range: `${Hoja}!${IdC["Historico"]}${filaAEditar}`,
            values: [UpdateHistorico],
            valueInputOption: "USER_ENTERED",
        });
        
        response2 = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET,
            range: `${Hoja}!${IdC["Disponible"]}${filaAEditar}`,
            values: [data],
            valueInputOption: "USER_ENTERED",
        });
        response=[response1,response2];
    }else{
        const filaAEditar =  LUsuarios.indexOf(User) + 2;
        const retirado=Number(BDUsuarios[User]["Disponible"])-Number(data[1]);
        const totcat=retirado+Number(BDUsuarios[User][data[0]]);
        const UpdateHistorico =  [`${Historicoaux},${IdC[data[0]]}${retirado}@${datenow.getTime()}`];
        response1 = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET,
            range: `${Hoja}!${IdC["Historico"]}${filaAEditar}`,
            values: [UpdateHistorico],
            valueInputOption: "USER_ENTERED",
        });
        response2 = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET,
            range: `${Hoja}!${IdC["Disponible"]}${filaAEditar}`,
            values: [[data[1]]],
            valueInputOption: "USER_ENTERED",
        });

        response3 = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET,
            range: `${Hoja}!${IdC[data[0]]}${filaAEditar}`,
            values: [[totcat]],
            valueInputOption: "USER_ENTERED",
        
        });
        response=[response1,response2,response3];

    }

    updatedash();
return response;
}

//swFAce
face.addEventListener("click", () => {
    AUser=InUser.value;
    if (BDUsuarios.hasOwnProperty(AUser)) { 
        if (BDUsuarios[AUser].Pass==InPass.value) {
            let tl = anime.timeline({
                easing: "easeOutExpo",
                duration: 1050,
            });
            tl.add({
                targets: [face],
                translateX: switched ? -1 : 160,
                rotate: switched ? -360 : 360,
                backgroundColor: switched ? "rgb(77, 189, 73)" : "rgb(176, 235, 195)",
            },500).add({
                targets: [switchBG, background],
                backgroundColor: switched ? "rgb(32, 72, 49)" : "rgb(69, 245, 78)",
            },500).add({
                targets: ".eye-left",
                d:[{
                    value: switched ? eyeClosedL : eyeOpenL,
                }]},"-=1200").add({
                targets: ".eye-right",
                d: [{
                    value: switched ? eyeClosedR : eyeOpenR,
                }]},"-=1210").add({
                targets: ".mouth",
                d: [{
                    value: switched ? mouthClosed : mouthOpen,
                }]},"-=1210");
    
            if (switched == true) {
            //if true
                if (switchBG.classList.contains("on-shadow")) {
                    switchBG.classList.remove("on-shadow");
                }
                switchBG.classList.add("off-shadow");
                switched = false;
            } else {
                if (switchBG.classList.contains("off-shadow")) {
                    switchBG.classList.remove("off-shadow");
                }
                switchBG.classList.add("on-shadow");
                switched = true;
            }
            AUser=InUser.value;
            AHis=BDUsuarios[AUser].Historico;
            updatedash();           
            
            SignInUBt.click();


        } else {
            alert("Contraseña equivocada")
        }
        
    } else {
        alert("No existe Usuario")           
    }
});


/*DATA*/


AboBt.addEventListener("click",abonar);
DebBt.addEventListener("click",debitar);


function updatedash() {
    content.innerHTML = "Saldo Disponible: " + BDUsuarios[AUser].Disponible;
    const valores = Object.values(BDUsuarios[AUser]).slice(3, 7);
    xValues = Object.keys(BDUsuarios[AUser]).slice(3, 7);
    yValues = valores;
    barColors = Object.values(CHART_COLORS);
    myChart.data.labels=xValues;
    myChart.data.datasets[0].data=yValues;
    myChart.options.title.text=`Ultimos Gastos (Total: "
    ${valores.reduce((a, b) => Number(a) + Number(b),0)})`;
    myChart.update(); 
    Htable.innerHTML="";
    for (let i = 1; i < AHis.length+1; i++) {
        Htable.appendChild(newitemtr(i,AHis[i-1]));
    }
}

function newitemtr(i,tran){
    const itemac= document.createElement("tr");
    itemac.setAttribute("class","accordion-item");
    if (tran.Categoria=="Disponible") {
        itemac.innerHTML = `
            <th scope="row">${newformatDate(tran.Fecha)}</th>
            <td>${tran.valor}</td>
            <td></td>
            <td></td>`;
    } else {
        itemac.innerHTML = `
            <th scope="row">${newformatDate(tran.Fecha)}</th>
            <td></td>
            <td>${tran.valor}</td>
            <td>${tran.Categoria}</td>`;
    }    
    return itemac;
}

function abonar() {
    const AAbonar=Number(AbonarV.value)
    const total=Number(BDUsuarios[AUser].Disponible)+AAbonar;
    if (total<990) {
        transaccion(AUser,total);
        BDUsuarios[AUser].Disponible=total;
        BDUsuarios[AUser].Historico=[...BDUsuarios[AUser].Historico,{Fecha:datenow.getTime(),valor:AAbonar,Categoria:"Disponible"}];
        AHis=BDUsuarios[AUser].Historico;
        updatedash();
        showsaldo();
    }else{
        alert("superaste el maximo de tu cuenta")
    }    
}

function debitar() {
    const ADebitar=Number(DebitarV.value);
    const total=Number(BDUsuarios[AUser].Disponible)-ADebitar;
    if (total>10) {
        const ACategoria=CategoriaV.value;
        transaccion(AUser,ACategoria,total);
        BDUsuarios[AUser].Disponible=total;
        BDUsuarios[AUser][ACategoria]=(Number(BDUsuarios[AUser][ACategoria])+ADebitar)+'';
        BDUsuarios[AUser].Historico=[...BDUsuarios[AUser].Historico,{Fecha:datenow.getTime(),valor:ADebitar,Categoria:ACategoria}];
        AHis=BDUsuarios[AUser].Historico;
        showsaldo();
        updatedash();        
    }else{
        alert("superaste el minimo de tu cuenta")
    }    
}


const showsaldo=()=>SaldoACBTN.click();


// utilidades
function aplanar(str){
    str=str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]/gi, '').toLowerCase();
    return str;
}

function monyformat(valor){
    return valor.toLocaleString("en", {
        style: "currency",
        currency: "MXN"
    })

};

function datetonum(mifecha){
    /*
    const diffTime = Math.abs(mifecha - new Date("1900/01/01"));
    return  Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    */
    return (mifecha.getTime())
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function newformatDate(date) {
    date=new Date(Number(date));
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );

}

const pru=(s)=>console.log(undefined==s ? "hola" : "hola "+s)





