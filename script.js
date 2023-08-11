//SE pretende hacer una interfaz para la autenticacion y el manejo de una cuenta de cagero dando una imformacion adicionalpor medio de graficas y tablas



//Autenticacion Google
//AIzaSyBzwfUT71gZzBVA7R-Y7Wwg2gt5Npn6mAs
//ID CLIENTE 1006596615028-9osv2cjqqrkhrk43tcd1si4rm1hfqecq.apps.googleusercontent.com

/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console

//HEADER
//Datos API
const CLIENT_ID = '1006596615028-9osv2cjqqrkhrk43tcd1si4rm1hfqecq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBzwfUT71gZzBVA7R-Y7Wwg2gt5Npn6mAs';

//Datos Sheet
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

//MAIN
//Aplicativo 
let Main=document.getElementById("Maindiv");
Main.style.visibility="hidden";
let AUser //Usuario actual

//USERS
let InUser=document.getElementById("InputU1");
let InPass=document.getElementById("InputU2");


//SWFace
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
//Base de datos
let BDUsuarios;
let IdC;//Letra-categoria
let IdCR;//categoria-letra
let datenow= new Date();//Fecha actual
let AHis=[
            {Fecha:new Date().getTime(),valor:1,Categoria:"Disponible"},
            {Fecha:new Date().getTime(),valor:2,Categoria:"Disponible"},
            {Fecha:new Date().getTime(),valor:3,Categoria:"Otros"},
            {Fecha:new Date().getTime(),valor:4,Categoria:"Otros"}
        ];
//Accordion

//Saldo
let SaldoACBTN=document.getElementById("SaldoACBTN");
//Grafica
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

//Abonar
let AbonarV=document.getElementById("InputUA2");
let CategoriaV=document.getElementById("InputUA4");
let AboBt=document.getElementById("AboBt");

//Debitar
let DebitarV=document.getElementById("InputUA3");
let DebBt=document.getElementById("DebBt");

//Historico
let Htable = document.getElementById("Htable");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//HEADER

/// AUTENTICACION GOOGLE

//LOAD
InicializarAut();


/*
Esconde los botones hasta que el api este habilitada 
les asigna los callbacks
*/
function InicializarAut() {
    SignInBt.style.visibility = 'hidden';
    SignOutBt.style.visibility = 'hidden';

    SignInBt.addEventListener("click",handleAuthClick);
    SignOutBt.addEventListener("click",handleSignoutClick);
}

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


//GO
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
        await listMajors();//Lectura de datos
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

//EXIT
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

//BD NUBE sheets

/**Lectura
 * Print the names and majors of object in a sample spreadsheet:
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

    //Inicializar variables
    BDUsuarios = {};
    IdC={};
    IdCR={};
    let NewUser;//Variable auxiliar para usuario en iteracion actual
    
    range.values.forEach((fila) => {//leer fila a fila
        if (fila[0]=="User"){//Obtener Headers y formato de la base de datos
            
            fila.forEach((col,i)=>{//Header a letra
                IdC[col]=String.fromCharCode(i+65);
                IdCR[IdC[col]]=col;//inverso
            })
            return; 
        }else{
            NewUser = {};//Inicializar usuario para iteracion
            fila.forEach((col,i)=>{//crear json a partir de headers
                if (i>0) {
                    NewUser[Object.keys(IdC)[i]]=col;
                }
            })
            //Historico en string se repite para hacer subjnson

            let regex = /([A-ZA]+)|(\d+)/g;//para tomar palabras en mayusculas y numeros
            let aux=[];//Variable auxiliar array historico cormateado
            let Historicoaux=[];//Variable para subjsonhistorico
            fila[2].split(',').forEach((tran,i)=>{//obtener transacciones en formato {categoria}{valor}@{fecha},...
                aux=tran.match(regex);//separar en array
                Historicoaux.push({Fecha:aux[2],valor:aux[1],Categoria:IdCR[aux[0]]})//creacion subjson
            })
            NewUser[Object.keys(IdC)[2]]=Historicoaux;//Actualizar string con subjnson
            BDUsuarios[fila[0]]=NewUser;//agregar usuario a la BD
        }
    });    
}

/*Escritura
Funcion para actualizar sheets
*/
async function Updatesheet(Columna,rangedata,valordata) {
    let responsel = await gapi.client.sheets.spreadsheets.values.update({//promesa historico
        spreadsheetId: SPREADSHEET,
        range: `${Hoja}!${IdC[Columna]}${rangedata}`,
        values: [valordata],//Data en doble cochete [[]]
        valueInputOption: "USER_ENTERED",
    });  
    return responsel;
}

//SWFACE
face.addEventListener("click", () => {//Logueo usuario
    AUser=InUser.value;//Usuario actual
    if (BDUsuarios.hasOwnProperty(AUser)) { //Verificacion User
        if (BDUsuarios[AUser].Pass==InPass.value) {//Verificacion Pass
            let tl = anime.timeline({//animacion
                easing: "easeOutExpo",
                duration: 1050,
            });
            tl.add({//color inicial
                targets: [face],
                translateX: switched ? -1 : 160,
                rotate: switched ? -360 : 360,
                backgroundColor: switched ? "rgb(77, 189, 73)" : "rgb(176, 235, 195)",//color off
            },500).add({//color final
                targets: [switchBG, background],
                backgroundColor: switched ? "rgb(32, 72, 49)" : "rgb(69, 245, 78)",//color on
            },500).add({//abrir ojos
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
    
            if (switched == true) {//ON
            //if true
                if (switchBG.classList.contains("on-shadow")) {
                    switchBG.classList.remove("on-shadow");
                }
                switchBG.classList.add("off-shadow");
                switched = false;
            } else {//OFF
                if (switchBG.classList.contains("off-shadow")) {
                    switchBG.classList.remove("off-shadow");
                }
                switchBG.classList.add("on-shadow");
                switched = true;
            }

            AUser=InUser.value;//usuario actual
            AHis=BDUsuarios[AUser].Historico;//historico usuario actual
            updatedash();//Actualizar dasboard
            SignInUBt.click();//simular click en SW oculto para efecto collapse
        } else {
            alert("Contraseña equivocada")
        }
    } else {
        alert("No existe Usuario")           
    }
});



/*DATA*/
Inicializartransacciones()

/**
 * Funcion para agregar callbacks para transacciones
 */

function Inicializartransacciones(){
    AboBt.addEventListener("click",abonar);    
    DebBt.addEventListener("click",debitar);
}
function showsaldo(){SaldoACBTN.click()};


/**
 * Funcion para crear div filas 
 */
function newitemtr(i,tran){
    const tranm=monyformat(Number(tran.valor));
    const itemac= document.createElement("tr");//crear fila
    //agregar columnas
    if (tran.Categoria=="Disponible") {//Abono
        itemac.innerHTML = `
            <th scope="row">${newformatDate(tran.Fecha)}</th>
            <td>${tranm}</td>
            <td></td>
            <td></td>`;
    } else {//Debito
        itemac.innerHTML = `
            <th scope="row">${newformatDate(tran.Fecha)}</th>
            <td></td>
            <td>${tranm}</td>
            <td>${tran.Categoria}</td>`;
    }    
    return itemac;
}

/**
* Funcion para actualizar Grafica y tabla resumen del  estado de la cuenta
*/
function updatedash() {
    content.innerHTML = "Saldo Disponible: " + monyformat(Number(BDUsuarios[AUser].Disponible));//Actualizar saldo
    const valores = Object.values(BDUsuarios[AUser]).slice(3, 7);//Actualizar Valores categorias
    xValues = Object.keys(BDUsuarios[AUser]).slice(3, 7);//Actualizar Nombres Categorias
    yValues = valores;
    barColors = Object.values(CHART_COLORS);//colores

    //Actualizar Titulo
    myChart.options.title.text=`Ultimos Gastos (Total: ${monyformat(valores.reduce((a, b) => Number(a) + Number(b),0))})`;
    myChart.update(); 
    
    //Actualizar Ejes
    myChart.data.labels=xValues;
    myChart.data.datasets[0].data=yValues;

    //Actualizar tabla historico
    Htable.innerHTML="";//Reset historico
    for (let i = 1; i < AHis.length+1; i++) {
        Htable.appendChild(newitemtr(i,AHis[i-1]));//Agregar fila
    }
}


// /**
//  * Actualizar base de datos en base a abonos y debitos (con funciones) corregir
//  */

// async function transaccionnube(User,...data) {
//     let LUsuarios=Object.keys(BDUsuarios);//Lista Usuarios
//     datenow=new Date();//Fecha actual
//     var response=[];//promesas
//     let Historicoaux=""//Inicializar historico
//     BDUsuarios[User].Historico.forEach((tran)=>{//json a string formato {categoria}{valor}@{fecha},...     
//         Historicoaux+=`${IdC[tran.Categoria]}${tran.valor}@${tran.Fecha},`
//     })
//     Historicoaux=Historicoaux.slice(0, -1);//quitar ultima coma
//     const filaAEditar =  LUsuarios.indexOf(User) + 2;//Usuaro actual + despues del header   
//     if (data.length==1){//Abono  DisponibleFinal=DisponibleActual+Abono
//         const UpdateHistorico =  [`${Historicoaux},${IdC["Disponible"]}${(data-BDUsuarios[User]["Disponible"])}@${datenow.getTime()}`];//Agregar Abono a historico Abono=DisponibleFinal-DisponibleActual

//         //No se pueden editar celdas no contiguas se editan por separado
//         response.push(await Updatesheet("Disponible",filaAEditar,data));//promesa Disponible
//     }else{//Debito Disponiblefinal=DisponibleActual-Debito
//         const retirado=Number(BDUsuarios[User]["Disponible"])-Number(data[1]);//Debito=DisponibleActual-Disponiblefinal
//         const totcat=retirado+Number(BDUsuarios[User][data[0]]);//TotalCategoria=Debito+CategoriaActual
//         const UpdateHistorico =  [`${Historicoaux},${IdC[data[0]]}${retirado}@${datenow.getTime()}`];//Agregar Debito a historico
//         response.push(await Updatesheet("Disponible",filaAEditar,[data[1]]));
//         response.push(await Updatesheet(IdC[data[0]],filaAEditar,[totcat]));        
//     }
//     response.unshift(await Updatesheet("Historico",filaAEditar,UpdateHistorico));//promesa historico
//     updatedash();
//     return response;
// }

// /**
//  * Actualizar base de datos en base a abonos y debitos
//  */

async function transaccionnube(User,...data) {

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
/**
 * Funcion para realizar un abono a la cuenta
 */
function abonar() {
    const AAbonar=Number(AbonarV.value)//Abono
    const total=Number(BDUsuarios[AUser].Disponible)+AAbonar;//Abono  DisponibleFinal=DisponibleActual+Abono

    if (total<990) {//Verificar maximo de cuenta
        transaccionnube(AUser,total);//Actualizar BD nube
        BDUsuarios[AUser].Disponible=total;//Actualizar BD Local
        BDUsuarios[AUser].Historico=[...BDUsuarios[AUser].Historico,{Fecha:datenow.getTime(),valor:AAbonar,Categoria:"Disponible"}];
        AHis=BDUsuarios[AUser].Historico;//Actualizar historico actual
        updatedash();//Actualizar Dashboard
        showsaldo();//Mostrar cambios
    }else{
        alert("superaste el maximo de tu cuenta")
    }    
}

/**
 * Funcion para realizar un debito a la cuenta
 */
function debitar() {
    const ADebitar=Number(DebitarV.value);//Debito
    const total=Number(BDUsuarios[AUser].Disponible)-ADebitar;//Debito Disponiblefinal=DisponibleActual-Debito
    if (total>10) {//Verificar minimo de cuenta
        const ACategoria=CategoriaV.value;//Categoria actual
        transaccionnube(AUser,ACategoria,total);//Actualizar BD nube
        BDUsuarios[AUser].Disponible=total;//Actualizar BD Local
        BDUsuarios[AUser][ACategoria]=(Number(BDUsuarios[AUser][ACategoria])+ADebitar)+'';//TotalCategoria=Debito+CategoriaActual
        BDUsuarios[AUser].Historico=[...BDUsuarios[AUser].Historico,{Fecha:datenow.getTime(),valor:ADebitar,Categoria:ACategoria}];
        AHis=BDUsuarios[AUser].Historico;
        updatedash();//Mostrar cambios 
        showsaldo();//Actualizar Dashboard            
    }else{
        alert("superaste el minimo de tu cuenta")
    }    
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Fin codigo

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// utilidades
/**
 * Funcion para pasar a minusculas sin tildes ni caracteres especiales
 */
function aplanar(str){
    str=str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]/gi, '').toLowerCase();
    return str;
}

/**
 * Funcion para dar formato dinero 
 */
function monyformat(valor){
    return valor.toLocaleString("en", {
        style: "currency",
        currency: "MXN"
    })

};

/**
 * Funciones para pasar de fecha a numero
 */
function datetonum(mifecha){
    /*
    const diffTime = Math.abs(mifecha - new Date("1900/01/01"));
    return  Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    */
    return (mifecha.getTime())
}

/**
 * Funciones para pasar de numero a fecha
 */
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

/**
 * Funcion para imprimir valores y pruebas
 */
const pru=(s)=>console.log(undefined==s ? "hola" : "hola "+s)





