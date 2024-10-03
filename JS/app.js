// Sélection des éléments du DOM en utilisant les bons ID
const input = document.querySelector("#text-input");  // Zone de texte
const wordCount = document.querySelector("#word-count");  // Compteur de mots
const characterCount = document.querySelector("#character-count");  // Compteur de caractères
const sentenceCount = document.querySelector("#sentence-count");  // Compteur de phrases
const paragraphCount = document.querySelector("#paragraph-count");  // Compteur de paragraphes
const keywordDensityElement = document.querySelector("#keyword-density"); // Éléments pour la densité de mots
const readingTimeElement = document.querySelector("#reading-time"); // Éléments pour le temps de lecture
const readabilityScoreElement = document.querySelector("#readability-score"); // Éléments pour le score de lisibilité
const repeatedWordsCount = document.querySelector("#repeated-words-count"); // Éléments pour le compte de mots répétitifs
const toneAnalysis = document.querySelector("#tone-analysis"); // Éléments pour l'analyse de tonalité

const resetButton = document.querySelector("#reset-btn"); // Bouton de réinitialisation
const exportButton = document.querySelector("#export-btn"); // Bouton d'exportation

document.getElementById('share-facebook').addEventListener('click', shareOnFacebook);
document.getElementById('share-twitter').addEventListener('click', shareOnTwitter);
document.getElementById('share-whatsapp').addEventListener('click', shareOnWhatsApp);

function shareOnWhatsApp() {
    const text = encodeURIComponent("Voici un texte intéressant à partager !");
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    window.open(shareUrl, '_blank');
}
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank');
}

function shareOnTwitter() {
    const text = encodeURIComponent("Voici un texte intéressant à partager !");
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, '_blank');
}
document.getElementById('share-email-btn').addEventListener('click', () => {
    const text = textInput.value;
    const subject = "Partage de texte";
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

// Fonction pour mettre à jour les compteurs
function updateCounts() {
    const text = input.value.trim(); // Supprime les espaces inutiles en début et fin de texte
    if (!text) {
        resetCounts();
        return;
    }

    // Compter les mots
    const wordsArray = text.split(/\s+/).filter(word => word.length > 0);
    wordCount.innerText = wordsArray.length;

    // Compter les caractères
    const charactersArray = text.split("").filter(character => character.trim().length > 0);
    characterCount.innerText = charactersArray.length;

    // Compter les phrases
    const sentencesArray = text.match(/[^.!?]*[.!?]/g) || [];
    sentenceCount.innerText = sentencesArray.length;

    // Compter les paragraphes
    const paragraphsArray = text.split(/\n+/).filter(paragraph => paragraph.trim().length > 0);
    paragraphCount.innerText = paragraphsArray.length;

    // Calculer la densité de mots
    const keywordDensity = calculateKeywordDensity(text);
    keywordDensityElement.innerText = keywordDensity.toFixed(2) + "%"; // Afficher la densité

    // Estimer le temps de lecture
    const readingTime = estimateReadingTime(wordsArray.length);
    readingTimeElement.innerText = readingTime + " minutes"; // Afficher le temps de lecture

    // Calculer la lisibilité
    const readability = calculateReadability(text);
    readabilityScoreElement.innerText = readability.toFixed(2); // Afficher le score de lisibilité

    // Compter les mots répétitifs
    const repeatedWordsCountValue = countRepeatedWords(text);
    repeatedWordsCount.innerText = repeatedWordsCountValue;

    // Analyser la tonalité
    const tone = analyzeTone(text);
    toneAnalysis.innerText = tone; // Afficher l'analyse de tonalité

    // Appeler la fonction pour rendre le graphique
    updateChart(wordsArray.length, sentencesArray.length, charactersArray.length);
}

// Fonction pour réinitialiser les compteurs
function resetCounts() {
    wordCount.innerText = 0;
    characterCount.innerText = 0;
    sentenceCount.innerText = 0;
    paragraphCount.innerText = 0;
    keywordDensityElement.innerText = "";
    readingTimeElement.innerText = "";
    readabilityScoreElement.innerText = "";
    repeatedWordsCount.innerText = 0;
    toneAnalysis.innerText = "";
}

// Ajout de l'événement d'écoute sur la zone de texte pour mettre à jour les compteurs en temps réel
input.addEventListener("input", updateCounts);

// Ajout de la fonctionnalité de réinitialisation
resetButton.addEventListener("click", () => {
    input.value = "";  // Vide la zone de texte
    resetCounts();  // Réinitialise les compteurs
});

// Fonctionnalité d'exportation du texte dans un fichier (optionnelle)
exportButton.addEventListener("click", () => {
    const textToExport = input.value;
    if (textToExport) {
        const blob = new Blob([textToExport], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "exported-text.txt";  // Nom du fichier exporté
        link.click();
        URL.revokeObjectURL(link.href);
    } else {
        alert("No text to export!");
    }
});

// Sauvegarde automatique
setInterval(() => {
    const text = input.value.trim();
    if (text) {
        localStorage.setItem('savedText', text);
    }
}, 5000); // Sauvegarde toutes les 5 secondes

// Récupérer le texte sauvegardé au chargement
window.onload = () => {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        input.value = savedText;
        updateCounts(); 
    }
};

async function checkGrammar(text) {
    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(text)}&language=fr`
        });
        const data = await response.json();
        return data.matches;
    } catch (error) {
        console.error('Error checking grammar:', error);
        alert('An error occurred while checking grammar. Please try again.');
        return [];
    }
}


// Bouton pour vérifier la grammaire
document.getElementById('check-grammar-btn').addEventListener('click', async () => {
    const text = input.value.trim();
    const grammarErrors = await checkGrammar(text);
    if (grammarErrors.length > 0) {
        alert(`Found ${grammarErrors.length} grammar errors.`);
    } else {
        alert("No grammar errors found!");
    }
});

// Bouton pour ajouter un titre
document.getElementById('title-btn').addEventListener('click', () => {
    const text = input.value.trim();
    input.value = `# ${text}`; // Ajoute un titre Markdown
});

// Bouton pour ajouter une liste
document.getElementById('list-btn').addEventListener('click', () => {
    const text = input.value.trim();
    input.value += `\n- `; 
});

