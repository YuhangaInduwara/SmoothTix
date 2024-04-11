document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');

    forms.forEach((form, index) => {
        const pointsInput = form.querySelector(`#points${index + 1}`);
        const starsContainer = form.querySelector(`#stars-container${index + 1}`);

        pointsInput.addEventListener('input', function() {
            const points = parseInt(pointsInput.value);

            // Clear previous stars
            starsContainer.innerHTML = '';

            // Add stars based on points
            for (let i = 0; i < points; i++) {
                const star = document.createElement('span');
                star.classList.add('star');
                star.textContent = '\u2605'; // Unicode character for star
                starsContainer.appendChild(star);
            }
        });
    });
});
