function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if(i.className === "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
   }
 


    var a = document.getElementById("loginBtn");
    var b = document.getElementById("registerBtn");
    var x = document.getElementById("login");
    var y = document.getElementById("register");

    function login() {
        x.style.left = "4px";
        y.style.right = "-520px";
        a.className += " white-btn";
        b.className = "btn";
        x.style.opacity = 1;
        y.style.opacity = 0;
    }

    function register() {
        x.style.left = "-510px";
        y.style.right = "5px";
        a.className = "btn";
        b.className += " white-btn";
        x.style.opacity = 0;
        y.style.opacity = 1;
    }

    
    document.getElementById("register-form").addEventListener("submit",function(event){
        event.preventDefault();
        var first_name=document.getElementById("Firstname").value;
        var last_name=document.getElementById("Lastname").value;
        var email=document.getElementById("Email").value;
        var password=document.getElementById("Password").value;
    
    

    
       
        if(password.length<8) {
            alert("Password must be at least 8 characters long");

            return false;
        }
    
        if(localStorage.getItem(email)) {
            alert("Email already registered");
            

            return false;
        }
        
        const user={
            name:first_name,
            email:email,
            password:password,
    
        };
    
        localStorage.setItem(email,JSON.stringify(user));
        alert("Registration success");

    
    
    });



    document.getElementById("login_form").addEventListener("submit", function (event) {
        event.preventDefault(); 
        var email = document.getElementById("login_email").value;
        var password = document.getElementById("login_password").value;

        fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "index.html";
            }
        })
        .catch(error => {
            alert(error.message);
        });
    });
