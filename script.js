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
const mainWindow = document.getElementById('mainWindow');
const secondClaimButtonContainer = document.getElementById('secondClaimButtonContainer');
const secondClaimButton = document.getElementById('secondClaimButton');
const leaderboardWindow = document.getElementById('leaderboardWindow');
const leaderboardList = document.getElementById('leaderboardList');

// Variables to manage chaos
let chaosWindows = [];
let chaosInterval = null;
let chaosCount = 0;
let isChaosActive = false;

// Store the verified telegramUsername
let verifiedUsername = '';

// Make the main window draggable
makeWindowDraggable(mainWindow);

// Make the leaderboard window draggable
makeWindowDraggable(leaderboardWindow);

// Function to make a window draggable
function makeWindowDraggable(windowElement) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const windowHeader = windowElement.querySelector('.window-header');

    windowHeader.addEventListener('mousedown', (e) => {
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

// Function to start chaotic effects by using in-page elements instead of popups
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

    // Start the chaos by spawning div elements that look like windows
    chaosInterval = setInterval(() => {
        // Create two chaos divs each interval
        for (let i = 0; i < 2; i++) {
            createChaosDiv();
        }

        // Optional: Set a maximum number of chaos divs
        chaosCount += 2;
        if (chaosCount >= 20) { // Adjust the limit as needed
            clearInterval(chaosInterval);
            chaosInterval = null;
        }
    }, 1000); // Spawn new chaos divs every 1 second
}

// Function to create a single chaos div
function createChaosDiv() {
    const chaosDiv = document.createElement('div');
    chaosDiv.className = 'chaos-div';

    // Position chaos div randomly on the screen
    const width = 300;
    const height = 200;
    const x = Math.floor(Math.random() * (window.innerWidth - width));
    const y = Math.floor(Math.random() * (window.innerHeight - height));

    chaosDiv.style.left = `${x}px`;
    chaosDiv.style.top = `${y}px`;

    // Add content to chaos div
    chaosDiv.innerHTML = `
        <video autoplay loop muted>
            <source src="https://telegram-dpreferral-backend.onrender.com/chaosvid.mp4" type="video/mp4">
        </video>
        <audio autoplay loop>
            <source src="https://telegram-dpreferral-backend.onrender.com/chaossound.mp3" type="audio/mpeg">
        </audio>
    `;

    // Append to body
    document.body.appendChild(chaosDiv);

    // Store reference
    chaosWindows.push(chaosDiv);

    // Play media when div is added
    const video = chaosDiv.querySelector('video');
    const audio = chaosDiv.querySelector('audio');
    video.play();
    audio.play();
}

// Event listener to check when chaos should end
document.addEventListener('click', () => {
    if (!isChaosActive) return;

    // Remove closed chaos divs
    chaosWindows = chaosWindows.filter(div => document.body.contains(div));

    // If no chaos divs are left, end chaos
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

// Fetch Leaderboard Data on Page Load
fetchLeaderboard();

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
