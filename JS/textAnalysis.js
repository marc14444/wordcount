// textAnalysis.js
const textInput = document.getElementById('text-input');

textInput.addEventListener('input', updateStatistics);

function updateStatistics() {
    const text = textInput.value;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const characterCount = text.length;
    const sentenceCount = (text.match(/[.!?]+/g) || []).length;
    const paragraphCount = (text.match(/\n/g) || []).length + 1; // +1 pour le dernier paragraphe

    document.getElementById('word-count').textContent = wordCount;
    document.getElementById('character-count').textContent = characterCount;
    document.getElementById('sentence-count').textContent = sentenceCount;
    document.getElementById('paragraph-count').textContent = paragraphCount;

    // Densité des mots-clés
    const keywordDensity = calculateKeywordDensity(words);
    document.getElementById('keyword-density').textContent = keywordDensity;

    // Temps de lecture estimé
    const readingTime = Math.ceil(wordCount / 200); // Supposant une lecture à 200 mots par minute
    document.getElementById('reading-time').textContent = `${readingTime} min`;

    // Score de lisibilité
    const readabilityScore = calculateReadabilityScore(wordCount, sentenceCount, paragraphCount);
    document.getElementById('readability-score').textContent = readabilityScore;

    // Compteur de mots répétés
    const repeatedWordsCount = countRepeatedWords(words);
    document.getElementById('repeated-words-count').textContent = repeatedWordsCount;

    // Analyse de tonalité (exemple simple)
    const toneAnalysis = analyzeTone(text);
    document.getElementById('tone-analysis').textContent = toneAnalysis;

    console.log(`wordCount: ${wordCount}, characterCount: ${characterCount}, sentenceCount: ${sentenceCount}`);
    updateChart(wordCount, characterCount, sentenceCount, paragraphCount, keywordDensity, readingTime, readabilityScore, repeatedWordsCount, toneAnalysis);

    // Suggestions de phrases
    const sentenceSuggestions = suggestShorterSentences(text);
    const suggestionsList = document.getElementById('sentence-suggestions');
    suggestionsList.innerHTML = '';
    sentenceSuggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });

    // Suggestions de synonymes
    const synonymsList = document.getElementById('synonym-suggestions');
    synonymsList.innerHTML = '';
    words.forEach(word => {
        const synonyms = suggestSynonyms(word);
        if (synonyms.length > 0) {
            const li = document.createElement('li');
            li.textContent = `Synonymes pour "${word}": ${synonyms.join(', ')}`;
            synonymsList.appendChild(li);
        }
    });
}

function calculateKeywordDensity(words) {
    // Implémentation simple de la densité des mots-clés
    const keywords = ['exemple', 'test']; // Liste des mots-clés
    let count = 0;
    words.forEach(word => {
        if (keywords.includes(word.toLowerCase())) {
            count++;
        }
    });
    return (count / words.length * 100).toFixed(2) + '%';
}

function calculateReadabilityScore(wordCount, sentenceCount, paragraphCount) {
    // Calcul simple du score de lisibilité (par exemple, formule de Flesch-Kincaid)
    return (206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (sentenceCount / paragraphCount)).toFixed(2);
}

function countRepeatedWords(words) {
    const wordMap = {};
    words.forEach(word => {
        wordMap[word] = (wordMap[word] || 0) + 1;
    });
    return Object.values(wordMap).filter(count => count > 1).length;
}

const toneKeywords = {
    triste: ['triste', 'déprimé', 'malheureux', 'mécontent','mal'],
    heureux: ['heureux', 'joyeux', 'content', 'satisfait',''],
    neutre: ['normal', 'ordinaire', 'banal']
};

function analyzeTone(text) {
    const lowerText = text.toLowerCase();
    let tone = 'Neutre'; // Valeur par défaut

    for (const [key, keywords] of Object.entries(toneKeywords)) {
        if (keywords.some(word => lowerText.includes(word))) {
            tone = key.charAt(0).toUpperCase() + key.slice(1); // Mettre en majuscule
            break;
        }
    }

    return tone;
}

let chart; // Déclarez la variable ici
function updateChart(wordCount, characterCount, sentenceCount, paragraphCount, keywordDensity, readingTime, readabilityScore, repeatedWordsCount, toneAnalysis) {
    const ctx = document.getElementById('statsChart').getContext('2d');

    // Détruire l'ancien graphique s'il existe
    if (chart) {
        chart.destroy();
    }

    // Créer un nouveau graphique
    chart = new Chart(ctx, { 
        type: 'bar',
        data: {
            labels: ['Mots', 'Caractères', 'Phrases', 'Paragraphes', 'Densité des mots-clés (%)', 'Temps de lecture (min)', 'Score de lisibilité', 'Mots répétés', 'Analyse de tonalité'],
            datasets: [{
                label: 'Statistiques',
                data: [wordCount, characterCount, sentenceCount, paragraphCount, parseFloat(keywordDensity), readingTime, parseFloat(readabilityScore), repeatedWordsCount, toneAnalysis === 'Neutre' ? 0 : 1], // Utiliser 1 pour ton positif et 0 pour ton neutre
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', 
                    'rgba(153, 102, 255, 0.2)', 
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)', // Pour paragraphes
                    'rgba(54, 162, 235, 0.2)', // Pour densité
                    'rgba(255, 159, 64, 0.2)', // Pour temps de lecture
                    'rgba(75, 192, 192, 0.2)', 
                    'rgba(153, 102, 255, 0.2)', 
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', 
                    'rgba(153, 102, 255, 1)', 
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)', // Pour paragraphes
                    'rgba(54, 162, 235, 1)', // Pour densité
                    'rgba(255, 159, 64, 1)', // Pour temps de lecture
                    'rgba(75, 192, 192, 1)', 
                    'rgba(153, 102, 255, 1)', 
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
const readAloudButton = document.querySelector("#read-aloud-btn");

// Fonction pour lire le texte à voix haute
function readAloud(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "fr-FR";  // Langue française
    window.speechSynthesis.speak(speech);
}

// Ajouter un événement d'écoute pour le bouton
readAloudButton.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
        readAloud(text);
    } else {
        alert("Veuillez entrer du texte à lire !");
    }
});

function suggestShorterSentences(text) {
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const longSentences = sentences.filter(sentence => sentence.split(' ').length > 20); // Phrases de plus de 20 mots
    const suggestions = longSentences.map(sentence => `Considérez de réduire cette phrase : "${sentence.trim()}"`);
    return suggestions;
}

// Propositions de synonymes
const synonymsDictionary = {
    "rapide": ["vite", "prompt", "célère"],
    "beau": ["joli", "charmant", "attrayant"],
    "rapidité": ["vitesse", "promptitude", "célérité"],
    
    // Ajoutez d'autres mots et leurs synonymes ici
};

function suggestSynonyms(word) {
    return synonymsDictionary[word] || [];
}

