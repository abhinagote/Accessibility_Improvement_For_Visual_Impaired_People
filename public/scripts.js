    document.addEventListener('DOMContentLoaded', () => {
    const speechForm = document.getElementById('uploadSpeechForm');
    const brailleForm = document.getElementById('uploadBrailleForm');
    const cancelSpeechButton = document.getElementById('cancelSpeechButton');
    const cancelBrailleButton = document.getElementById('cancelBrailleButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadLink = document.getElementById('downloadLink');
    const brailleDownloadLink = document.getElementById('brailleDownloadLink');
    const extractedText = document.getElementById('extractedText');

    let abortController;

    speechForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(speechForm);

        loadingSpinner.style.display = 'block';

        abortController = new AbortController();
        const { signal } = abortController;

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
                signal,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();

            loadingSpinner.style.display = 'none';

            extractedText.textContent = result.text;

            if (result.audioPath) {
                audioPlayer.src = result.audioPath;
                audioPlayer.style.display = 'block';
                audioPlayer.play();
                downloadLink.href = result.audioPath;
                downloadLink.style.display = 'block';
            }

            if (result.braillePath) {
                brailleDownloadLink.href = result.braillePath;
                brailleDownloadLink.style.display = 'block';
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Upload canceled');
            } else {
                console.error('Error:', error);
            }

            loadingSpinner.style.display = 'none';
        }
    });

    brailleForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(brailleForm);

        loadingSpinner.style.display = 'block';

        abortController = new AbortController();
        const { signal } = abortController;

        try {
            const response = await fetch('/upload-braille', {
                method: 'POST',
                body: formData,
                signal,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();

            loadingSpinner.style.display = 'none';

            if (result.braillePath) {
                brailleDownloadLink.href = result.braillePath;
                brailleDownloadLink.style.display = 'block';
            }

            if (result.audioPath) {
                audioPlayer.src = result.audioPath;
                audioPlayer.style.display = 'block';
                audioPlayer.play();
                downloadLink.href = result.audioPath;
                downloadLink.style.display = 'block';
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Upload canceled');
            } else {
                console.error('Error:', error);
            }

            loadingSpinner.style.display = 'none';
        }
    });

    cancelSpeechButton.addEventListener('click', () => {
        if (abortController) {
            abortController.abort();
        }
    });

    cancelBrailleButton.addEventListener('click', () => {
        if (abortController) {
            abortController.abort();
        }
    });
});
