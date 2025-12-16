document.addEventListener('DOMContentLoaded', () => {
    const bio = document.getElementById('bio');
    const counter = document.getElementById('bio_counter');

    bio.addEventListener('input', () => {
        counter.textContent = `${bio.value.length} / 20`;
    });
});
