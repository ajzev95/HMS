//todas las variables globales
let userInfo;
let user; //aqui se guardan los datos del usuario
let allBData = []; //aqui se guardan los datos de la reserva
let allInHData = []; //aqui se guarda de los datos de checkin
let allArchData = []; //aqui se guardan los datos de la reserva
let allCashData = []; //aqui se guardan los datos de la reserva
let allCashArchData = []; //aqui se guardan los datos de la reserva
let navBar = document.querySelector(".navbar-brand"); //nombre del hotel
let logoutBtn = document.querySelector(".logout-btn"); //boton de logout
let bookingForm = document.querySelector(".booking-form"); //formulario de reserva    
let allBInput = bookingForm.querySelectorAll("input"); //inputs de la reserva
let bTextarea = bookingForm.querySelector("textarea"); //textarea de la reserva
let inHouseForm = document.querySelector(".inhouse-form"); //formulario de checkin     
let allInHInput = inHouseForm.querySelectorAll("input"); //inputs de checkin
let InHTextarea = inHouseForm.querySelector("textarea"); //textarea de la reserva
let modalCBtn = document.querySelectorAll(".btn-close"); //boton de cerrar el modal 
let bListTBody = document.querySelector(".booking-list");  //tbody de la tabla de reservas  
let inHListTBody = document.querySelector(".inhouse-list");  //tbody de la tabla de checkin
let archListTBody = document.querySelector(".archive-list");  //tbody de la tabla de checkin
let bRegBtn = document.querySelector(".b-register-btn"); //boton de registro de reservas 
let inHRegBtn = document.querySelector(".in-house-reg-btn"); //boton de registro de reservas
let allTabBtn = document.querySelectorAll(".tab-btn"); //boton de registro de reservas
let searchEl = document.querySelector(".search-input"); //input de busqueda
let cashierBtn = document.querySelector(".cashier-tab")//boton de cashier
let cashierTab = document.querySelector("#cashier")//tab de cashier
let bookingTab = document.querySelector("#booking")//tab de booking
let cashierForm = document.querySelector(".cashier-form");//formulario de cashier
let allCInput = cashierForm.querySelectorAll("input");//inputs de cashier
let cashBtn = document.querySelector(".cash-btn");//boton de cashier
let cashierTbody = document.querySelector(".cashier-list");//tbody de cashier
let cashTotal = document.querySelector(".total");//total de cashier
let closeCashierBtn = document.querySelector(".close-cashier-btn");//boton de cerrar cashier 
let cashierArchTbody = document.querySelector(".cashier-arch-list");//boton de cerrar cashier 
let archTotal = document.querySelector(".arch-total");//total de cashier   
let allPrintBtn = document.querySelectorAll(".print-btn");//boton de imprimir 
let archPrintBtn = document.querySelector(".arch-print-btn");// boton de imprimir
let carchierTabPan = document.querySelector(".cashier-tab-pan");// tab de cashier
let allTotalBtn = document.querySelectorAll(".total-btn");//boton de total
let showBRoomsEl = document.querySelector(".show-booking-rooms"); //boton de mostrar habitaciones
let showHRoomsEl = document.querySelector(".show-inhouse-rooms"); //boton de mostrar habitaciones

//verificamos si el usuario ya iniciado sesion o no
if (sessionStorage.getItem("__au__") == null) {
    window.location = "../index.html";
}
userInfo = JSON.parse(sessionStorage.getItem("__au__"));
navBar.innerHTML = userInfo.hotelName;
user = userInfo.email.split("@")[0];

//imprimir codigo
for(let btn of allPrintBtn)
{
    btn.onclick = () => {
        window.print();//abrimos la ventana de impresion
    }
}

archPrintBtn.onclick = () => {
    carchierTabPan.classList.add('d-none'); //ocultamos el tab de cashier
    window.print();//abrimos la ventana de impresion
}
modalCBtn[3].onclick = () => { //cerramos el modal de cashier
    carchierTabPan.classList.remove('d-none'); //mostramos el tab de cashier
}

//check hotel habitaciones
const checkRooms = (element) =>{
    if(Number(userInfo.totalRoom) < Number(element.value))
    {
        swal("warning",`Total ${userInfo.totalRoom} rooms is avalbale in the hotel`, "warning");
        element.value = userInfo.totalRoom;
    }
} 

allBInput[2].oninput = (e) =>{
    checkRooms(e.target);
}
allInHInput[2].oninput = (e) =>{
    checkRooms(e.target);
}

//getting data from local storage
const fetchData = (key) => {
    if (localStorage.getItem(key) != null) {
        const data = JSON.parse(localStorage.getItem(key));
        return data;
    } else {
        return [];
    }
};

//se guardan todos los datos de la reserva
allBData = fetchData(user + "_allBData"); //a_allBData, si no hay datos, inicializamos el array vacio
allInHData = fetchData(user + "_allInHData"); //a_allInHData, si no hay datos, inicializamos el array vacio
allArchData = fetchData(user + "_allArchData"); //a_allArchData, si no hay datos, inicializamos el array vacio
allCashData = fetchData(user + "_allCashData"); //a_allCashData, si no hay datos, inicializamos el array vacio
allCashArchData = fetchData(user + "_allCashArchData"); //a_allCashArchData, si no hay datos, inicializamos el array vacio

//obtenemos los datos de la reserva
const formatDate = (data, isTime) => {
    const date = new Date(data);
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1; //months are zero based
    let dd = date.getDate();
    let time = date.toLocaleTimeString();
    dd = dd < 10 ? "0" + dd : dd;
    mm = mm < 10 ? "0" + mm : mm;
    return `${dd}-${mm}-${yy} ${isTime ? time : ""}`; //si es true, devolvemos la fecha con la hora, si no, solo la fecha
};

//aqui se guardan los datos de la reserva
const registrationFunc = (textarea = null, inputs, array, key) => {
    let data = {
        notice: textarea && textarea.value,
        inHouse: false,
        createdAt: new Date(),
    };
    for (let el of inputs) {
        let key = el.name;
        let value = el.value;
        data[key] = value;
    }
    array.unshift(data);
    localStorage.setItem(key, JSON.stringify(array));
    swal("Good job!", "Your booking has been sent successfully!", "success");
}

//mostramos el modal
const ShowData = (element, array, key) => {
    let tmp = key.split("_")[1];
    element.innerHTML = ""; //limpiamos el tbody antes de mostrar los datos
    array.forEach((item, index) => {
        element.innerHTML += `
            <tr>
                <td class="no-print text-nowrap">${index + 1}</td>
                <td class="text-nowrap">${item.location}</td>
                <td class="text-nowrap">${item.roomNo}</td>
                <td class="text-nowrap">${item.fullname}</td>
                <td class="text-nowrap">${formatDate(item.checkInData)}</td>
                <td class="text-nowrap">${formatDate(item.checkOutData)}</td>
                <td class="text-nowrap">${item.totalPeople}</td>
                <td class="text-nowrap">${item.mobile}</td>
                <td class="text-nowrap">${item.price}</td>
                <td class="text-nowrap">${item.notice}</td>
                <td class="text-nowrap no-print">${formatDate(item.createdAt, true)}</td>
                <td class="text-nowrap no-print">
                    <button class="${tmp == 'allArchData' && 'd-none'} btn edit-btn p-0 px-1 btn-primary">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn checkin-btn p-0 px-1 text-white btn-success">
                        <i class="fa fa-check"></i>
                    </button>
                    <button class="btn del-btn p-0 px-1 btn-danger">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
    deleteDataFunc(element, array, key); //llamamos a la funcion de eliminar reserva
    updateDataFunc(element, array, key); //llamamos a la funcion de editar reserva
    checkInAndCheckout(element, array, key); //llamamos a la funcion de checkin y checkout
};

//aqui se elimina los datos de la reserva
//eliminar reserva
const deleteDataFunc = (element, array, key) => {
    let allBdelBtn = element.querySelectorAll(".del-btn");
    allBdelBtn.forEach((btn, index) => {
        btn.onclick = () => {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this imaginary file!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    array.splice(index, 1); //eliminamos el elemento del array
                    localStorage.setItem(key, JSON.stringify(array)); //actualizamos el local storage
                    ShowData(element, array, key); //actualizamos la tabla
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Your imaginary file is safe!");
                }
            });
        };
    });
};

//actualizamos la reserva
//aqui se actualizan los datos de la reserva
const updateDataFunc = (element, array, key) => {
    let allEditBtn = element.querySelectorAll(".edit-btn");
    allEditBtn.forEach((btn, index) => {
        btn.onclick = () => {
            //bRegBtn.click(); //abrimos el modal de reserva
            let tmp = key.split("_")[1];
            tmp == 'allBData' ? bRegBtn.click() : inHRegBtn.click(); //abrimos el modal de reserva o checkin
            //return false; //evitamos que se recargue la pagina
            let allBtn = tmp == 'allBData'
                ? bookingForm.querySelectorAll("button")
                : inHouseForm.querySelectorAll("button") //botones del formulario de reserva

            let allInput = tmp == 'allBData'
                ? bookingForm.querySelectorAll("input")
                : inHouseForm.querySelectorAll("input") //botones del formulario de reserva

            let textarea = tmp == 'allBData'
                ? bookingForm.querySelector("textarea")
                : inHouseForm.querySelector("textarea") //botones del formulario de reserva

            allBtn[0].classList.add("d-none"); //ocultamos el boton de registro
            allBtn[1].classList.remove("d-none"); //mostramos el boton de actualizar

            let obj = array[index]; //obtenemos el objeto de la reserva
            allInput[0].value = obj.fullname; //nombre
            allInput[1].value = obj.location; //lugar
            allInput[2].value = obj.roomNo; //numero de habitacion
            allInput[3].value = obj.totalPeople; //total de personas
            allInput[4].value = obj.checkOutData; //fecha de salida
            allInput[5].value = obj.checkInData; //fecha de entrada
            allInput[6].value = obj.price; //precio
            allInput[7].value = obj.mobile; //telefono
            textarea.value = obj.notice; //mesaje
            allBtn[1].onclick = () => { //boton de actualizar
                let formData = {
                    notice: textarea.value,//mensaje
                    createdAt: new Date(), //fecha de creacion
                }
                for (let el of allInput) { //recorremos los inputs
                    let key = el.name; //obtenemos el nombre del input
                    let value = el.value; //obtenemos el valor del input
                    formData[key] = value; //guardamos el valor en el objeto
                }

                array[index] = formData; //actualizamos el objeto en el array
                allBtn[0].classList.remove("d-none"); //ocultamos el boton de registro
                allBtn[1].classList.add("d-none"); //mostramos el boton de actualizar

                tmp == "allBData"
                    ? bookingForm.reset('')//limpiamos el formulario
                    : inHouseForm.reset('');//limpiamos el formulario

                tmp == "allBData"
                    ? modalCBtn[0].click() //cerramos el modal
                    : modalCBtn[1].click() //cerramos el modal
                localStorage.setItem(key, JSON.stringify(array)); //actualizamos el local storage
                ShowData(element, array, key); //actualizamos la tabla
            }
        }
    });

};

//aqui se hace el checkin y checkout
const checkInAndCheckout = (element, array, key) => {
    let allCheckBtn = element.querySelectorAll(".checkin-btn");
    allCheckBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let tmp = key.split("_")[1];
            let data = array[index]; //obtenemos el objeto de la reserva
            array.splice(index, 1); //eliminamos el elemento del array
            localStorage.setItem(key, JSON.stringify(array)); //actualizamos el local storage
            if (tmp == "allBData") {
                allInHData.unshift(data); //agregamos el objeto al array de checkin
                localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData)); //actualizamos el local storage
                ShowData(element, array, key); //actualizamos la tabla
                showBookingRooms(); //actualizamos la tabla de habitaciones
                showInhouseRooms();
            } else if (tmp == "allArchData") {
                allBData.unshift(data); //agregamos el objeto al array de checkin
                localStorage.setItem(user + "_allBData", JSON.stringify(allBData)); //actualizamos el local storage
                ShowData(element, array, key); //actualizamos la tabla
                showBookingRooms();
                showInhouseRooms(); //actualizamos la tabla de habitaciones
            } else {
                allArchData.unshift(data); //agregamos el objeto al array de checkin
                localStorage.setItem(user + "_allArchData", JSON.stringify(allArchData)); //actualizamos el local storage
                ShowData(element, array, key); //actualizamos la tabla
                showInhouseRooms();
                showBookingRooms();
            }
        }
    });
}

//show mostramos las habitaciones booking
const showBookingRooms = () => {
    showBRoomsEl.innerHTML = ''; //limpiamos el tbody antes de mostrar los datos
    allBData.forEach((item, index) => {
        showBRoomsEl.innerHTML += `
        <div class="card text-center px-0 col-md-2">
            <div class="bg-danger text-white fw-bold card-header">
                ${item.roomNo}
            </div>
            <div class="bg-success text-white fw-bold card-body">
                <p>${formatDate(item.checkInData)}</p>
                <p>To</p>
                <p>${formatDate(item.checkOutData)}</p>
            </div>
        </div>
        `;
    })
}
showBookingRooms();

//show mostramos las habitaciones inhouse
const showInhouseRooms = () => {
    showHRoomsEl.innerHTML = ''; //limpiamos el tbody antes de mostrar los datos
    allInHData.forEach((item, index) => {
        console.log(item);
        showHRoomsEl.innerHTML += `
        <div class="card text-center px-0 col-md-2">
            <div class="bg-danger text-white fw-bold card-header">
                ${item.roomNo}
            </div>
            <div class="card-body">
                <img src="${item.inHouse ? '../img/batman.png' : '../img/lock.png'}" class="w-100" alt="">
            </div>
            <div class="card-footer">
            <button class="in-btn btn btn-dark"><i class="fa-solid fa-plane-circle-check"></i></button>
            <button class="out-btn btn btn-dark"><i class="fa-solid fa-plane-lock"></i></button>
            </div>
        </div>
        `;
    });
    //codigo de in
    let allInBtn = showHRoomsEl.querySelectorAll(".in-btn");
    allInBtn.forEach((btn,index) => {
        btn.onclick = () =>{
            let data = allInHData[index];
            data.inHouse = true;
            allInHData[index] = data;
            localStorage.setItem(user + "_allInHData",JSON.stringify(allInHData));
            showInhouseRooms();
        }
    })
    //codigo de out
    let allOutBtn = showHRoomsEl.querySelectorAll(".out-btn");
    allOutBtn.forEach((btn,index) => {
        btn.onclick = () =>{
            let data = allInHData[index];
            data.inHouse = false;
            allInHData[index] = data;
            localStorage.setItem(user + "_allInHData",JSON.stringify(allInHData));
            showInhouseRooms();
        }
    })
}
showInhouseRooms();

//aqui se guardan los datos de la reserva
const showTotal = () => {
    allTotalBtn[0].innerText = "Total Booking = "+allBData.length; //total de reservas
    allTotalBtn[1].innerText = "Total Inhouse= "+allInHData.length; //total de reservas
    allTotalBtn[2].innerText = "Total Archive= "+allArchData.length; //total de reservas
}
showTotal();

//cerramos sesion codigo
logoutBtn.onclick = () => {
    logoutBtn.innerHTML = "Please wait...";
    setTimeout(() => {
        logoutBtn.innerHTML = "Logout";
        sessionStorage.removeItem("__au__");
        window.location = "../index.html";
    }, 3000);
};

//iniciamos booking store codigo
bookingForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(bTextarea, allBInput, allBData, user + "_allBData"); //guardamos los datos de la reserva
    bookingForm.reset('');
    modalCBtn[0].click();
    ShowData(bListTBody, allBData, user + "_allBData"); //mostramos los datos en la tabla booking
    showTotal();//mostramos el total
    showBookingRooms();//mostramos las habitaciones booking
};

//iniciamos cashier store codigo
cashierForm.onsubmit = (e) => {
    e.preventDefault();

    registrationFunc(null, allCInput, allCashData, user + "_allCashData"); //guardamos los datos de la reserva
    cashierForm.reset('');
    modalCBtn[2].click();
    showCashierFunc();
};

//iniciamos inhouse booking codigo
inHouseForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(InHTextarea, allInHInput, allInHData, user + "_allInHData"); //guardamos los datos de la reserva
    inHouseForm.reset('');
    modalCBtn[1].click();
    ShowData(inHListTBody, allInHData, user + "_allInHData"); //mostramos los datos en la tabla booking
    showTotal();
    showInhouseRooms();
};

const searchFunc = () => {
    let value = searchEl.value.toLowerCase(); //obtenemos el valor del input de busqueda
    let tableEl = document.querySelector(".tab-content .search-pane.active")//obtenemos el elemento de la tabla activa
    let tr = tableEl.querySelectorAll("tbody tr"); //obtenemos todas las filas de la tabla
    for (let el of tr) {
        let srNo = el.querySelectorAll("td")[0].innerText; //obtenemos todas las celdas de la fila
        let location = el.querySelectorAll("td")[1].innerText; //obtenemos todas las celdas de la fila
        let roomNo = el.querySelectorAll("td")[2].innerText; //obtenemos todas las celdas de la fila
        let fullname = el.querySelectorAll("td")[3].innerText; //obtenemos todas las celdas de la fila
        let mobile = el.querySelectorAll("td")[7].innerText; //obtenemos todas las celdas de la fila
        let price = el.querySelectorAll("td")[8].innerText; //obtenemos todas las celdas de la fila
        if (srNo.indexOf(value) != -1) {
            el.classList.remove('d-none'); //mostramos la fila
        } else if (location.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none'); //mostramos la fila
        } else if (roomNo.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none'); //mostramos la fila
        } else if (fullname.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none'); //mostramos la fila
        } else if (mobile.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none'); //mostramos la fila
        } else if (price.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none'); //mostramos la fila
        } else {
            el.classList.add('d-none'); //ocultamos la fila
        }
    }
}

//codigo buscar
searchEl.oninput = () => {
    searchFunc()
}

//actualizamos el ui data
for (let btn of allTabBtn) {//recorremos los botones
    btn.onclick = () => {
        ShowData(bListTBody, allBData, user + "_allBData"); //mostramos los datos en la tabla 
        ShowData(inHListTBody, allInHData, user + "_allInHData"); //
        ShowData(archListTBody, allArchData, user + "_allArchData");// 
    }
}

ShowData(bListTBody, allBData, user + "_allBData"); //mostramos los datos en la tabla 
ShowData(inHListTBody, allInHData, user + "_allInHData");
ShowData(archListTBody, allArchData, user + "_allArchData");
//mostramos los datos en la tabla booking

//cashier codigo
const showCashierFunc = () => {
    let totalAmount = 0; //total de cashier
    cashierTbody.innerHTML = ''; //limpiamos el tbody antes de mostrar los datos
    allCashData.forEach((item, index) => {
        totalAmount += +item.amount; //sumamos el total - parseInt(item.amount)
        cashierTbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.roomNo}</td>
            <td>${item.cashierName}</td>
            <td>${formatDate(item.createdAt,true)}</td>
            <td>${item.amount}</td>
        </tr>
        `
    });
    cashTotal.innerHTML = "<i class='fa fa-rupe'></i> $ "+totalAmount; //mostramos el total
}
showCashierFunc();

//todo el archive cash codigo
const showCashArchFunc = () => {
    let totalAmount = 0; //total de cashier
    cashierArchTbody.innerHTML = ''; //limpiamos el tbody antes de mostrar los datos
    allCashArchData.forEach((item, index) => {
        const total = Number(item.total) || 0;
        totalAmount += total; //sumamos el total - parseInt(item.amount) o +item.total
        cashierArchTbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.cashierName}</td>
            <td>${formatDate(item.createdAt,true)}</td>
            <td>${item.total}</td>
        </tr>
        `
    });
    archTotal.innerHTML = " $ "+totalAmount; //mostramos el total
}
showCashArchFunc();

//mostramos los datos en la tabla cashier

cashBtn.onclick = () => {
    allCInput[2].value = sessionStorage.getItem("c_name");
}

cashierBtn.onclick = () => {
    if (sessionStorage.getItem("c_name") == null) {
        let name = window.prompt("Enter your name!");
        if (name) {
            sessionStorage.setItem("c_name", name);
            allCInput[2].value = name;
        } else {
            allTabBtn[0].classList.add("active");
            bookingTab.classList.add("active");
            cashierBtn.classList.remove("active");
            cashierTab.classList.remove("active");
        }
    } else {
        allCInput[2].value = sessionStorage.getItem("c_name");
    }
}

//cerramos cashier
closeCashierBtn.onclick = () =>{
    if(allCashData.length > 0)
    {
        //const numericTotal = parseFloat(cashTotal.innerText.replace(/[^0-9.]/g, ''));
        const total = allCashData.reduce((sum, item) => sum + Number(item.amount), 0);
        
        let data = {
            cashierName : sessionStorage.getItem("c_name"),
            total : total, //numericTotal o cashTotal.innerText
            createdAt : new Date() 
        }
        allCashArchData.push(data); //agregamos el objeto al array de checkin
        allCashData = []; //limpiamos el array de cashier
        localStorage.removeItem(user + "_allCashData"); //eliminamos el local storage
        localStorage.setItem(user + "_allCashArchData", JSON.stringify(allCashArchData)); //actualizamos el local storage
        showCashierFunc();
        showCashArchFunc(); // Actualizar el modal de archivo
        sessionStorage.removeItem("c_name"); // Limpiar el nombre del cajero
        allCInput[2].value = ""; // Limpiar el input
    }else{
        swal("Warning!", "There no cash to close", "warning");
    }
}

//finalizado
