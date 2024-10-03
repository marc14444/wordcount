// darkMode.js
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('bg-gray-900');
    document.body.classList.toggle('text-white');

    const statsContainer = document.querySelector('.stats-container');
    statsContainer.classList.toggle('bg-gray-800');
    statsContainer.classList.toggle('text-gray-300');

    // Gérer le stockage local pour garder le mode sombre
    if (document.body.classList.contains('bg-gray-900')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
});

// Vérifier le mode sombre au chargement de la page
if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('bg-gray-900', 'text-white');
}
