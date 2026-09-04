let currentPage = 1;
let totalPages = 1;
let currentUserRole = null;
async function loadMovies() {
    try {
        let url = `/api/movies?page=${currentPage}`;
        const genre = document.getElementById('genre-filter').value;
        if (genre) {
            url += `&genre=${encodeURIComponent(genre)}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.movies

        const container = document.getElementById('movie-list');

        if (!response.ok) {
            const errorMessage = data.error || "Failed to load movies";
            // FIX 1: pehle "movies.error" tha — 404 response mein "movies" key hoti hi nahi
            // (sirf { error: "..." } aata hai), isliye "movies.error" = undefined.error = CRASH
            // "data.error" use karna hai kyunki error seedha data ke top-level pe hota hai
            container.innerHTML = `<p class="empty-state" style="color: #ff4d4d;">⚠️ ${errorMessage}</p>`;
            return;
        }
        totalPages = data.totalPages;
        document.getElementById('page-indicator').textContent = `Page ${currentPage}`;

        container.innerHTML = movies.map(movie => `
    <div class="movie-card">
        ${movie.poster
                ? `<img src="/uploads/${movie.poster}" alt="${movie.title}" class="movie-poster">`
                : `<div class="movie-poster-placeholder">🎬</div>`
            }
        <h3>${movie.title}</h3>
        <div class="movie-meta">
            <span>${movie.genre} • ${movie.releaseyear}</span>
            <span class="rating-badge">★ ${movie.rating}</span>
        </div>
       <div class="card-actions">
    <a href="/movie-detail.html?title=${encodeURIComponent(movie.title)}" class="btn btn-primary">View</a>
    ${currentUserRole === 'admin' ? `
    <a href="/edit.html?title=${encodeURIComponent(movie.title)}" class="btn btn-secondary">Edit</a>
    <button class="btn btn-danger" onclick="deleteMovie('${movie.title}')">Delete</button>
    ` : ''}
</div>
    </div>
`).join('');
        document.getElementById('prev-page').disabled = (currentPage <= 1);
        document.getElementById('next-page').disabled = (currentPage >= totalPages);
    } catch (error) {
        alert("Error" + error.message)
    }
}
async function deleteMovie(title) {
    try {
        const confirmed = confirm(`Are you sure you want to delete ${title}`);
        if (!confirmed) {
            return;
        }
        const response = await fetchWithAuth(`/api/movies/${encodeURIComponent(title)}`, { method: 'DELETE' })
        if (response.ok) {
            loadMovies()
        }
        else {
            const data = await response.json();
            alert(`ERROR : ${data.error}`)
        }
    } catch (error) {
        console.error("Delete request failed ", error);
        alert("Failed to delete movie")
    }
}
async function searchmovies(searchTerm) {
    if (!searchTerm) {
        loadMovies();
        return;
    }

    const response = await fetch(`/api/movies/${encodeURIComponent(searchTerm)}`);

    const container = document.getElementById('movie-list');
    if (!response.ok) {
        container.innerHTML = `<p class="empty-state">No movies found.</p>`;
        return;
    }
    const movies = await response.json();
    if (movies.error) {
        container.innerHTML = `<p class="empty-state">No movies found.</p>`;
        return;
    }

    container.innerHTML = movies.map(movie => `
    <div class="movie-card">
        ${movie.poster
            ? `<img src="/uploads/${movie.poster}" alt="${movie.title}" class="movie-poster">`
            : `<div class="movie-poster-placeholder">🎬</div>`
        }
        <h3>${movie.title}</h3>
        <div class="movie-meta">
            <span>${movie.genre} • ${movie.releaseyear}</span>
            <span class="rating-badge">★ ${movie.rating}</span>
        </div>
        <div class="card-actions">
    <a href="/movie-detail.html?title=${encodeURIComponent(movie.title)}" class="btn btn-primary">View</a>
    <!-- FIX 2: pehle "movie.title" seedha URL mein tha bina encodeURIComponent ke —
         agar title mein special characters (&, :, # waghera) hote, URL corrupt ban jati
         thi aur "Movie not found" error aata tha View click karne pe -->
    ${currentUserRole === 'admin' ? `
    <a href="/edit.html?title=${encodeURIComponent(movie.title)}" class="btn btn-secondary">Edit</a>
    <button class="btn btn-danger" onclick="deleteMovie('${movie.title}')">Delete</button>
    ` : ''}
    <!-- FIX 3: pehle Edit/Delete buttons search results mein hamesha dikhte the,
         chahe user admin ho ya na ho — ab loadMovies() jaisa hi role-check add kiya -->
</div>
    </div>
`).join('');
}

document.getElementById('search-input').addEventListener('input', (e) => {
    searchmovies(e.target.value)
})
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadMovies();
    }
})
document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    loadMovies();
})
document.getElementById('genre-filter').addEventListener('change', () => {
    currentPage = 1;
    loadMovies();
})
async function checkLoginStatus() {
    try {
        let response = await fetch('/api/users/me');
        if (response.status === 401) {
            const refreshresponse = await fetch('/api/users/refresh', { method: 'POST' })
            if (refreshresponse.ok) {
                response = await fetch('/api/users/me')
            }
        }

        if (response.ok) {
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'inline-block';
            const data = await response.json();
            currentUserRole = data.role;
        }
    }
    catch (error) {
        console.error("login check failed", error)
    }
}
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST'
        })
        if (response.ok) {
            window.location.href = '/login.html'
        }
    } catch (error) {
        console.error("Logout failed", error)
    }
})
loadMovies();
checkLoginStatus().then(()=>{
    loadMovies();
});