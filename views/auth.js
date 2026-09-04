async function fetchWithAuth(url, options = {}) {
    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshResponse = await fetch('/api/users/refresh', { method: 'POST' });
       if(refreshResponse.ok){
        response = await fetch(url,options)
       }
       else{
        window.location.href ='/login.html'
       }
    }

    return response;
}