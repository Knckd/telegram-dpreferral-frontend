// script.js

// Backend URL
const backendUrl = 'https://telegram-dpreferral-backend.onrender.com'; // Use your actual backend domain

// Elements
const claimButton = document.getElementById('claimButton');
const claimMessage = document.getElementById('claimMessage');
const chaosSound = document.getElementById('chaosSound');
const claimModal = document.getElementById('claimModal');
const closeModal = document.getElementById('closeModal');
const submitUsername = document.getElementById('submitUsername');
const telegramUsernameInput = document.getElementById('telegramUsername');
const modalMessage = document.getElementById('modalMessage');
const mainContent = document.querySelector('.main-content');
const browserWindow = document.querySelector('.browser-window');
const secondClaimButtonContainer = document.getElementById('secondClaimButtonContainer');
const secondClaimButton = document.getElementById('secondClaimButton');

// Variables to manage chaos
let chaosWindows = [];
let chaosInterval = null;
let chaosCount = 0;
let isChaosActive = false;

// Store the verified telegramUsername
let verifiedUsername = '';

// Center the browser window (existing code remains the same)
// ... [Existing code for centering and dragging the window] ...

// Handle initial CLAIM Button Click
claimButton.addEventListener('click', () => {
    openModal();
});

// Close Modal when 'x' is clicked
closeModal.addEventListener('click', () => {
    closeModalFunc();
});

// Close Modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target == claimModal) {
        closeModalFunc();
    }
});

// Handle Submit Username (Verification)
// ... [Existing code remains the same] ...

// Handle Second CLAIM Button Click
secondClaimButton.addEventListener('click', async () => {
    if (!verifiedUsername) {
        alert('Please verify your Telegram username first.');
        return;
    }

    // Hide the second CLAIM button
    secondClaimButtonContainer.style.display = 'none';

    claimMessage.textContent = 'Initiating chaos...';

    // Start Chaos Effect
    startChaos();

    try {
        // Send messages via backend
        const sendMessagesResponse = await fetch(`${backendUrl}/api/sendReferral`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramUsername: verifiedUsername }),
        });

        const sendMessagesData = await sendMessagesResponse.json();

        if (sendMessagesData.success) {
            claimMessage.textContent = 'Check your Telegram for further instructions!';
        } else {
            claimMessage.textContent = 'Failed to send messages via Telegram. Please contact support.';
        }
    } catch (error) {
        console.error('Error:', error);
        claimMessage.textContent = 'An error occurred while sending messages. Please try again.';
    }
});

// Function to start chaotic effects by opening windows with video and sound
function startChaos() {
    if (isChaosActive) return; // Prevent multiple chaos starts
    isChaosActive = true;

    // Disable scrolling
    document.body.classList.add('no-scroll');

    // Play chaos sound on the main page
    if (chaosSound) {
        chaosSound.loop = true;
        chaosSound.play();
    }

    // Open all chaos windows during user interaction
    const totalChaosWindows = 20; // Adjust the number as needed
    for (let i = 0; i < totalChaosWindows; i++) {
        const chaosWindow = window.open('', '_blank', 'width=640,height=360');
        if (chaosWindow) {
            // Keep the window hidden initially
            chaosWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Chaos Window ${i + 1}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: black;
                            overflow: hidden;
                        }
                        body.hidden {
                            display: none;
                        }
                        video {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    </style>
                </head>
                <body class="hidden">
                    <video autoplay loop muted>
                        <source src="https://telegram-dpreferral-backend.onrender.com/chaosvid.mp4" type="video/mp4">
                    </video>
                    <audio autoplay loop>
                        <source src="https://telegram-dpreferral-backend.onrender.com/chaossound.mp3" type="audio/mpeg">
                    </audio>
                    <script>
                        // Prepare to show the window later
                        window.isRevealed = false;
                    </script>
                </body>
                </html>
            `);

            // Store the window reference
            chaosWindows.push(chaosWindow);
        } else {
            console.warn('Pop-up blocked. Please allow pop-ups for this site to enable the chaos effect.');
            alert('Pop-up blocked. Please allow pop-ups for this site to enable the chaos effect.');
            endChaos();
            return;
        }
    }

    // Start revealing the chaos windows gradually
    let currentWindowIndex = 0;
    chaosInterval = setInterval(() => {
        if (currentWindowIndex >= chaosWindows.length) {
            clearInterval(chaosInterval);
            return;
        }

        const chaosWindow = chaosWindows[currentWindowIndex];
        if (chaosWindow && !chaosWindow.closed) {
            chaosWindow.document.body.classList.remove('hidden');

            // Move the window to a random position
            const width = 640;
            const height = 360;
            const x = Math.floor(Math.random() * (screen.width - width));
            const y = Math.floor(Math.random() * (screen.height - height));
            chaosWindow.moveTo(x, y);
        }

        currentWindowIndex++;
    }, 1000); // Reveal a new window every 1 second
}

// Add a single focus listener to detect when chaos windows are closed
window.addEventListener('focus', () => {
    if (!isChaosActive) return;

    // Update the chaosWindows array by removing closed windows
    chaosWindows = chaosWindows.filter(w => !w.closed);

    // If no chaos windows are left, end chaos
    if (chaosWindows.length === 0) {
        endChaos();
    }
});

// Function to end chaos
function endChaos() {
    if (!isChaosActive) return;
    isChaosActive = false;

    // Clear the interval
    if (chaosInterval) {
        clearInterval(chaosInterval);
        chaosInterval = null;
    }

    // Remove no-scroll class
    document.body.classList.remove('no-scroll');

    // Stop sound on the main page
    if (chaosSound) {
        chaosSound.pause();
        chaosSound.currentTime = 0;
    }

    // Notify the user
    alert('The chaos has ended! Check your Telegram for further instructions.');
}
