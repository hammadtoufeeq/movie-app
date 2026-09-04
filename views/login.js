document.getElementById('login-form').addEventListener("submit", async(e)=> {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try{
        const response = await fetch('/api/users/login',
            {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({email,password})
            }
        )
        const data = await response.json();
        if(response.ok){
            window.location.href='/';
        }else{
            alert(`ERROR : ${data.error}`)
        }
    }
    catch(error){
        console.error("failed to login " , error);
        alert(`Failed to login ${error}`)
    }
})