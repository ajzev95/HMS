//todos las variables globales
let allUserInfo = [];
let regForm = document.querySelector(".reg-form"); 
let loginForm = document.querySelector(".login-form"); 
let allInput = regForm.querySelectorAll("input");
let allLoginInput = loginForm.querySelectorAll("input");
let regBtn = regForm.querySelector("button");
let loginBtn = loginForm.querySelector("button");

if(userInfo = localStorage.getItem("allUserInfo") != null)
{
    allUserInfo = JSON.parse(localStorage.getItem("allUserInfo"));
}
console.log(allUserInfo);

//codigo de registro
regForm.onsubmit = (e) =>{
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    let checkEmail = allUserInfo.find((data) => {
        return data.email == allInput[4].value;
    });
    if(checkEmail == undefined)
    {
        let data = {};
        for(let el of allInput)
        {
            let key = el.name;
            data[key] = el.value;
        }
        regBtn.innerText = "Proccessing...";
        setTimeout(() =>{
            regBtn.innerText = "Register";
            allUserInfo.push(data);
            localStorage.setItem("allUserInfo", JSON.stringify(allUserInfo));
            // Limpiar el formulario después de enviar
            swal("Good Jobs!",'Registration Successfull', 'success');
        },2000)
    } else 
    {
        swal("Failed!",'Email already exists', 'warning');
    }
    
}

//codigo de inicio de sesion
loginForm.onsubmit = (e) =>{
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    if(allLoginInput[0].value != "")
    {
        if(allLoginInput[1].value != "")
        {
            //verificar si el usuario o email existe
            let checkEmail = allUserInfo.find((data)=>{
                return data.email == allLoginInput[0].value
            });
            if(checkEmail != undefined)
            {
                //verificar si la contraseña es correcta
                if(checkEmail.password ==  allLoginInput[1].value)
                {
                    loginBtn.innerText = "Proccessing...";
                    setTimeout(() =>{
                        loginBtn.innerText = "Login";
                        window.location = "profile/profile.html";
                        checkEmail.password = null; // eliminar la contraseña antes de guardar en sessionStorage
                        sessionStorage.setItem("__au__", JSON.stringify(checkEmail));
                    },2000)
                } else {
                    swal("Failed!",'Password is incorrect', 'warning');
                }
            } else {
                swal("Failed!",'Email not found', 'warning');
            }
        } else {
            swal("Warning!",'Password is empty!', 'warning');
        }
    } else {
        swal("Warning!",'Email is empty!', 'warning');
    }
}

//video 7