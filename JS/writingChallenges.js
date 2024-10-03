// Exemples de défis d'écriture
const writingChallenges = [
    { id: 1, description: "Écrire un poème de 10 vers", points: 10 },
    { id: 2, description: "Rédiger un article de 300 mots", points: 15 },
    // Ajoutez d'autres défis ici
];

let totalPoints = 0;
let writingStreak = 0;

// Ajoute les défis à la liste
const challengesList = document.getElementById('challenges-list');
writingChallenges.forEach(challenge => {
    const li = document.createElement('li');
    li.textContent = challenge.description;
    challengesList.appendChild(li);
});

// Gestion de la soumission de texte
document.getElementById('submit-writing-btn').addEventListener('click', () => {
    const writingText = document.getElementById('writing-input').value;
    if (writingText.trim() === '') {
        alert('Veuillez écrire quelque chose avant de soumettre.');
        return;
    }

    // Vérifiez si l'utilisateur a complété un défi
    writingChallenges.forEach(challenge => {
        if (writingText.split(' ').length >= 10 && challenge.id === 1) { // Exemple pour le défi de poème
            completeChallenge(challenge);
            alert(`Bravo ! Vous avez complété le défi : "${challenge.description}".`);
        }
        // Ajoutez d'autres vérifications pour d'autres défis
    });

    // Mettez à jour le compteur de jours d'écriture consécutifs
    updateWritingStreak();
    document.getElementById('writing-input').value = ''; // Réinitialise la zone de texte
});

// Fonction pour compléter un défi
function completeChallenge(challenge) {
    totalPoints += challenge.points;
    document.getElementById('points-count').textContent = totalPoints;
}

// Fonction pour mettre à jour le compteur de jours d'écriture consécutifs
function updateWritingStreak() {
    writingStreak += 1; // Augmentez le compteur
    document.getElementById('streak-count').textContent = writingStreak;
}
