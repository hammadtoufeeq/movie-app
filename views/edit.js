const params = new URLSearchParams(window.location.search)
const movietitle = params.get('title')

async function loadmoviesdetails(){
    const response = await fetch(`/api/movies/${encodeURIComponent(movietitle)}`)
    const data = await response.json();
    const movie = Array.isArray(data) ? data[0] : data;
    document.getElementById('title').value = movie.title
    document.getElementById('genre').value = movie.genre
    document.getElementById('rating').value = movie.rating
    document.getElementById('releaseyear').value = movie.releaseyear

}

document.getElementById('edit-form').addEventListener('submit' ,async (e)=>{
     e.preventDefault();
     
        const title = document.getElementById('title').value
        const genre = document.getElementById('genre').value
        const rating = document.getElementById('rating').value
        const releaseyear = document.getElementById('releaseyear').value
        const posterFile = document.getElementById('poster').files[0]; 
        
        const formData = new FormData();
        formData.append('title',title);
        formData.append('genre',genre);
        formData.append('rating',rating);
        formData.append('releaseyear',releaseyear);
        if(posterFile){
         formData.append('poster',posterFile);
        }
     
  
     const response = await fetchWithAuth(`/api/movies/${encodeURIComponent(movietitle)}`,
     {
        method : 'PATCH',
        body : formData
    }
)
     if(response.ok){
        alert("Edited Successfully");
        loadmoviesdetails();
     }
     else{
        const data = await response.json();
        alert(`ERROR : ${data.error}`)
     }
})

loadmoviesdetails()