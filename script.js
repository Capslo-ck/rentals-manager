const password = document.getElementById("password");
const email = document.getElementById("email");

const toggle = document.getElementById("togglePassword");

const loginBtn = document.getElementById("loginBtn");

const message = document.getElementById("message");

toggle.addEventListener("click", () => {

    if(password.type === "password"){
        password.type = "text";
        toggle.textContent = "🙈";
    }else{
        password.type = "password";
        toggle.textContent = "👁";
    }

});

loginBtn.addEventListener("click", () => {

    const userEmail = email.value.trim();

    const userPassword = password.value.trim();

    message.style.color = "#dc2626";

    if(userEmail === ""){
        message.textContent = "Please enter your email.";
        return;
    }

    if(!userEmail.includes("@")){
        message.textContent = "Please enter a valid email.";
        return;
    }

    if(userPassword === ""){
        message.textContent = "Please enter your password.";
        return;
    }

    message.style.color = "green";
    message.textContent = "Logging in...";

    setTimeout(() => {

        message.textContent = "Ready for backend connection.";

    },2000);

});
