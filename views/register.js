document.getElementById('register-form').addEventListener('submit',async (e)=>{
   
    e.preventDefault();
   
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    try{
        const response = await fetch('/api/users/register',{
            method : 'POST',
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({ email , password })
        })
        const data = await response.json();
        if(response.ok){
            alert("Registration Successfull ! Please login. ");
            window.location.href = "/login.html"
        }else{
            alert(`ERROR : ${data.error}`)
        }
    }catch(error){
        console.error("failed to registration" , error);
        alert("Failed to register")
    }

})
