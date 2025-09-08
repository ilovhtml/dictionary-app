 const wordInput = document.getElementById('word-input');
        const searchButton = document.getElementById('search-button');
        const resultContainer = document.getElementById('result-container');
        const headElement = document.getElementById('head');
        const resultContent = document.getElementById('result-content');
        const audioElement = document.getElementById('get-audio');

        async function searchWord() {
            const word = wordInput.value.trim();
            if (!word) return;

            // Show loading state
            resultContainer.innerHTML = '<div class="loading">Searching...</div>';
            audioElement.classList.add('hidden');

            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                
                if (!response.ok) {
                    throw new Error('Word not found');
                }

                const data = await response.json();
                displayResult(data[0]);
            } catch (error) {
                displayError();
            }
        }

        function displayResult(data) {
            const word = data.word;
            const phonetic = data.phonetic || '';
            const meanings = data.meanings || [];
            
            // Set up audio if available
            if (data.phonetics && data.phonetics.length > 0) {
                const audioUrl = data.phonetics.find(p => p.audio)?.audio;
                if (audioUrl) {
                    audioElement.src = audioUrl;
                    audioElement.classList.remove('hidden');
                }
            }

            // Build result HTML
            let resultHTML = `
                <div class="result-card">
                    <h1 id="head">${word}</h1>
                    ${phonetic ? `<div class="phonetic">${phonetic}</div>` : ''}
            `;

            meanings.forEach(meaning => {
                resultHTML += `
                    <div class="definition-section">
                        <div class="part-of-speech">${meaning.partOfSpeech}</div>
                `;
                
                meaning.definitions.forEach(def => {
                    resultHTML += `
                        <div class="definition">${def.definition}</div>
                        ${def.example ? `<div class="example">Example: "${def.example}"</div>` : ''}
                    `;
                });
                
                resultHTML += '</div>';
            });

            resultHTML += '</div>';
            resultContainer.innerHTML = resultHTML;
        }

        function displayError() {
            resultContainer.innerHTML = `
                <div class="error-message">
                    Word not found. Please check your spelling and try again.
                </div>
            `;
            audioElement.classList.add('hidden');
        }

        // Event listeners
        searchButton.addEventListener('click', searchWord);
        wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchWord();
            }
        });

        // Focus input on page load
        wordInput.focus();