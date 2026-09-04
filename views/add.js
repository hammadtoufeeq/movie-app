document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;
    const releaseyear = document.getElementById('releaseyear').value;
    const posterFile = document.getElementById('poster').files[0];

    if (!title || !genre || !rating || !releaseyear) {
        alert("Please fill in all fields!");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('rating', rating);
    formData.append('releaseyear', releaseyear);
    if (posterFile) {
        formData.append('poster', posterFile);
    }

    try {
        const response = await fetchWithAuth(`/api/movies`, {
            method: 'POST',
            body: formData
        })
        const data = await response.json();
        if (response.ok) {
            window.location.href = '/';
        }
        else {
            alert(`ERROR : ${data.error}`)
        }
    } catch (error) {
        console.error("Fetch error", error);
        alert("Failed to send request to server")
    }
})
