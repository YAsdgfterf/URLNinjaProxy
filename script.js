
function isValidUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const urlInput = document.getElementById('urlInput');
    const submitButton = document.getElementById('submitButton');
    const errorDiv = document.getElementById('error');
    const url = urlInput.value;

    if (!isValidUrl(url)) {
        errorDiv.textContent = "Please enter a valid HTTP or HTTPS URL";
        return;
    }

    submitButton.disabled = true;
    errorDiv.textContent = '';

    // Open in new about:blank tab and make it fullscreen
    const win = window.open('about:blank');
    if (win) {
        win.document.write(`
            <html>
                <head>
                    <title>embedddddr</title>
                    <style>
                        body, html { 
                            margin: 0; 
                            padding: 0; 
                            height: 100%; 
                            overflow: hidden;
                        }
                        iframe { 
                            border: none; 
                            width: 100%; 
                            height: 100%;
                        }
                    </style>
                </head>
                <body>
                    <iframe src="${url}" allowfullscreen></iframe>
                    <script>
                        document.querySelector('iframe').requestFullscreen();
                    </script>
                </body>
            </html>
        `);
    }

    urlInput.value = '';
    submitButton.disabled = false;
}
