document.addEventListener('DOMContentLoaded', function () {
   isAuthenticated().then(() => fetchAllData());
});

function fetchReviewData() {
    fetch(`${url}/reviewController`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(reviewData => {
        displayReviews(reviewData);
    })
    .catch(error => {
        console.error('Error fetching reviews:', error);
    });
}

function displayReviews(reviews) {
    // Loop through each review and populate the corresponding form
    reviews.forEach((review, index) => {
        const form = document.querySelector(`#form${index + 1}`);

        // Populate input fields with review data

        //form.querySelector(`#PassengerName${index + 1}`).value = review.passenger_name;
        form.querySelector(`#review${index + 1}`).value = review.comments;
        form.querySelector(`#points${index + 1}`).value = review.point_id;

        // Display stars based on the number of points
        const starsContainer = form.querySelector(`#stars-container${index + 1}`);
        starsContainer.innerHTML = ''; // Clear previous stars

        for (let i = 0; i < review.point_id; i++) {
            const star = document.createElement('span');
            star.textContent = '\u2605'; // Unicode character for star
            starsContainer.appendChild(star);
        }
    });
}
