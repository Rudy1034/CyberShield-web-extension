// document.getElementById('urlForm').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const url = document.getElementById('urlInput').value;
//     const resultsDiv = document.getElementById('results');
//     const scoreDiv = document.getElementById('score');
//     const detailsPre = document.getElementById('details');
//     const errorDiv = document.getElementById('error-message');
//     const scoreBarContainer = document.getElementById('score-bar-container');
//     const scoreBar = document.getElementById('score-bar');
//     const downloadButton = document.getElementById('download-report');
//     const loadingDiv = document.getElementById('loading');

//     resultsDiv.classList.add('hidden');
//     errorDiv.textContent = '';
//     scoreBarContainer.classList.add('hidden');
//     scoreBar.style.width = '0%';
//     downloadButton.classList.add('hidden');
//     loadingDiv.style.display = 'inline-block';

//     try {
//         const response = await fetch('http://127.0.0.1:5000/api/check-url', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ url }),
//         });

//         if (response.ok) {
//             const result = await response.json();
//             const finalScore = result.final_score.toFixed(2);
//             const details = JSON.stringify(result.details, null, 2);

//             scoreDiv.textContent = `Final Score: ${finalScore}`;
//             const scorePercentage = finalScore * 100;
//             scoreBar.style.width = `${scorePercentage}%`;
//             scoreBar.style.backgroundColor = finalScore > 0.7 ? 'green' : finalScore > 0.4 ? 'orange' : 'red';

//             resultsDiv.classList.remove('hidden');
//             scoreBarContainer.classList.remove('hidden');

//             const reportContent = `
// Website Security Report
// =======================
// URL: ${url}
// Final Score: ${finalScore}

// Details:
// ${details}`;
//             const blob = new Blob([reportContent], { type: 'text/plain' });
//             const fileUrl = URL.createObjectURL(blob);

//             downloadButton.href = fileUrl;
//             downloadButton.download = `Website_Security_Report_${url.replace(/https?:\/\//, '').replace(/\//g, '_')}.txt`;
//             downloadButton.classList.remove('hidden');
//         } else {
//             const error = await response.json();
//             errorDiv.textContent = `Error: ${error.error}`;
//         }
//     } catch (error) {
//         errorDiv.textContent = 'Error: Unable to connect to the server.';
//     } finally {
//         loadingDiv.style.display = 'none';
//     }
// });
document.getElementById('urlForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('urlInput').value;
    const resultsDiv = document.getElementById('results');
    const scoreDiv = document.getElementById('score');
    const detailsPre = document.getElementById('details');
    const errorDiv = document.getElementById('error-message'); // For error messages
    const scoreBarContainer = document.getElementById('score-bar-container'); // For score bar
    const scoreBar = document.getElementById('score-bar'); // Actual score bar
    const downloadButton = document.getElementById('download-report'); // For downloading report
    const loadingDiv = document.getElementById('loading'); // Loading animation

    // Hide results and clear previous messages or styles
    resultsDiv.classList.add('hidden');
    scoreDiv.textContent = '';
    errorDiv.textContent = '';
    scoreBarContainer.classList.add('hidden');
    scoreBar.style.width = '0%'; // Reset score bar width
    downloadButton.classList.add('hidden'); // Hide the download button

    // Show loading animation
    loadingDiv.style.display = 'inline-block';

    try {
        const response = await fetch('http://127.0.0.1:5000/api/check-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (response.ok) {
            const result = await response.json();
            const finalScore = result.final_score.toFixed(2);
            const details = JSON.stringify(result.details, null, 2);

            // Update the score
            scoreDiv.textContent = `Final Score: ${finalScore}`;

            // Update the score bar
            const scorePercentage = finalScore * 100;
            scoreBar.style.width = `${scorePercentage}%`;
            if (finalScore > 0.7) {
                scoreBar.style.backgroundColor = 'green';
            } else if (finalScore > 0.4) {
                scoreBar.style.backgroundColor = 'orange';
            } else {
                scoreBar.style.backgroundColor = 'red';
            }

            // Show results and score bar
            resultsDiv.classList.remove('hidden');
            scoreBarContainer.classList.remove('hidden');

            // Prepare the report for download
            const reportContent = `
Website Security Report
=======================
URL: ${url}
Final Score: ${finalScore}

Details:
${details}
            `;
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const fileUrl = URL.createObjectURL(blob);

            downloadButton.href = fileUrl;
            downloadButton.download = `Website_Security_Report_${url.replace(/https?:\/\//, '').replace(/\//g, '_')}.txt`;
            downloadButton.classList.remove('hidden'); // Show the download button
        } else {
            const error = await response.json();
            errorDiv.textContent = `Error: ${error.error}`; // Display the error message
        }
    } catch (error) {
        errorDiv.textContent = `Error: Unable to connect to the server. Please try again later.`;
    } finally {
        // Hide loading animation
        loadingDiv.style.display = 'none';
    }
});
// document.getElementById('urlForm').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const url = document.getElementById('urlInput').value;
//     const resultsDiv = document.getElementById('results');
//     const scoreDiv = document.getElementById('score');
//     const detailsPre = document.getElementById('details');
//     const errorDiv = document.getElementById('error-message'); // Error message div under the button
//     const scoreBarContainer = document.getElementById('score-bar-container'); // For score bar
//     const scoreBar = document.getElementById('score-bar'); // Actual score bar
//     const downloadButton = document.getElementById('download-report'); // For downloading report
//     const loadingDiv = document.getElementById('loading'); // Loading animation

//     // Hide results and clear previous messages or styles
//     resultsDiv.classList.add('hidden');
//     scoreDiv.textContent = '';
//     detailsPre.textContent = '';
//     errorDiv.textContent = ''; // Clear previous error messages
//     scoreBarContainer.classList.add('hidden');
//     scoreBar.style.width = '0%'; // Reset score bar width
//     downloadButton.classList.add('hidden'); // Hide the download button

//     // Show loading animation
//     loadingDiv.style.display = 'inline-block';

//     // Basic URL validation regex
//     const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

//     // Check if the URL is valid
//     if (!urlRegex.test(url)) {
//         errorDiv.textContent = 'Error: Invalid URL'; // Show error under the button
//         loadingDiv.style.display = 'none'; // Hide loading animation
//         return; // Stop the function if URL is invalid
//     }

//     try {
//         const response = await fetch('http://127.0.0.1:5000/api/check-url', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ url }),
//         });

//         if (response.ok) {
//             const result = await response.json();
//             const finalScore = result.final_score.toFixed(2);
//             const details = JSON.stringify(result.details, null, 2);

//             // Update the score
//             scoreDiv.textContent = `Final Score: ${finalScore}`;

//             // Update the score bar
//             const scorePercentage = finalScore * 100;
//             scoreBar.style.width = `${scorePercentage}%`;
//             if (finalScore > 0.7) {
//                 scoreBar.style.backgroundColor = 'green';
//             } else if (finalScore > 0.4) {
//                 scoreBar.style.backgroundColor = 'orange';
//             } else {
//                 scoreBar.style.backgroundColor = 'red';
//             }

//             // Show results and score bar
//             resultsDiv.classList.remove('hidden');
//             scoreBarContainer.classList.remove('hidden');

//             // Prepare the report for download
//             const reportContent = `
// Website Security Report
// =======================
// URL: ${url}
// Final Score: ${finalScore}

// Details:
// ${details}
//             `;
//             const blob = new Blob([reportContent], { type: 'text/plain' });
//             const fileUrl = URL.createObjectURL(blob);

//             downloadButton.href = fileUrl;
//             downloadButton.download = `Website_Security_Report_${url.replace(/https?:\/\//, '').replace(/\//g, '_')}.txt`;
//             downloadButton.classList.remove('hidden'); // Show the download button
//         } else {
//             const error = await response.json();
//             errorDiv.textContent = `Error: ${error.error}`; // Display the error message
//         }
//     } catch (error) {
//         errorDiv.textContent = `Error: Unable to connect to the server. Please try again later.`;
//     } finally {
//         // Hide loading animation
//         loadingDiv.style.display = 'none';
//     }
// });

