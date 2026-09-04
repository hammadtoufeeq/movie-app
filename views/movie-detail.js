const params = new URLSearchParams(window.location.search);
const movietitle = params.get('title');
let currentMovieId = null;
let currentUserRole = null;

async function loadOneMovieDetail() {
    try {

        const response = await fetch(`/api/movies/${encodeURIComponent(movietitle)}`)
        const data = await response.json();

        const container = document.getElementById('movie-detail-container')

        if (!response.ok) {
            container.innerHTML = `<p class="empty-state">Movie not found.</p>`;
            return;
        }
        const movie = Array.isArray(data) ? data[0] : data;
        currentMovieId = movie._id;
        container.innerHTML = `
            <div class="detail-card">
                ${movie.poster
                ? `<img src="/uploads/${movie.poster}" alt="${movie.title}" class="detail-poster">`
                : `<div class="detail-poster-placeholder">🎬</div>`
            }
                <h2>${movie.title}</h2>
                <p>${movie.genre} • ${movie.releaseyear}</p>
                <p class="rating-badge">★ ${movie.rating}</p>
            </div>
            <div class="reviews-section">
                <h3>Reviews</h3>
                ${movie.reviews.length === 0
                ? `<p class="empty-state">No reviews yet.</p>`
                : movie.reviews.map(review => `
    <div class="review-card">
    <div class="review-header">
        <strong>${review.user}</strong>
        <span class="rating-badge">★ ${review.stars}</span>
    </div>
    <p>${review.comment}</p>
    ${currentUserRole === 'admin' ? `
    <button class="btn btn-danger" onclick="deleteReview('${review._id}')">Delete</button>
    ` : ''}
</div>
`).join('')
            }
            </div>`

    } catch (error) {
        console.error("Error loading movie details", error)
    }
}
document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value
    const comment = document.getElementById('comment').value
    const stars = document.getElementById('stars').value

    const response = await fetch(`/api/movies/${currentMovieId}/reviews`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, comment, stars })
    }
    )
    if (response.ok) {
        document.getElementById('review-form').reset();
        loadOneMovieDetail();
    }
    else {
        const data = await response.json();
        alert(`ERROR : ${data.error}`)
    }
})
async function deleteReview(reviewId) {
    try {
        const confirmed = confirm("Are you sure you want to delete this review?");
        if (!confirmed) {
            return;
        }
        const response = await fetchWithAuth(`/api/movies/${currentMovieId}/reviews/${reviewId}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            loadOneMovieDetail();
        } else {
            const data = await response.json();
            alert(`ERROR: ${data.error}`)
        }
    } catch (error) {
        console.error("Delete review failed", error);
        alert("Failed to delete review")
    }
}
async function checkLoginStatus() {
    try {
        let response = await fetch('/api/users/me');
        if (response.status === 401) {
            const refreshresponse = await fetch('/api/users/refresh', { method: 'POST' });
            if (refreshresponse.ok) {
                response = await fetch('/api/users/me');
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
        console.error("login check failed", error);
    }
}

loadOneMovieDetail();
checkLoginStatus().then(()=>{
    loadOneMovieDetail()
})