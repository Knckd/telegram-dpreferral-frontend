// script.js

// Replace with your backend URL
const backendUrl = 'https://your-backend-domain.com'; // Update this to your actual backend URL

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
const minimizeButton = document.querySelector('.control-button.minimize');
const maximizeButton = document.querySelector('.control-button.maximize');
const closeButton = document.querySelector('.control-button.close');
const secondClaimButtonContainer = document.getElementById('secondClaimButtonContainer');
const secondClaimButton = document.getElementById('secondClaimButton');

// Store the verified telegramUsername
let verifiedUsername = '';

// Center the browser window
function centerWindow() {
    const windowWidth = browserWindow.offsetWidth;
    const windowHeight = browserWindow.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const left = (viewportWidth - windowWidth) / 2;
    const top = (viewportHeight - windowHeight) / 2;
    browserWindow.style.left = `${left}px`;
    browserWindow.style.top = `${top}px`;
}

// Call the function to center the window
centerWindow();

// Re-center the window when the window is resized
window.addEventListener('resize', centerWindow);

// Make the browser window draggable
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const windowHeader = document.querySelector('.window-header');

windowHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - browserWindow.offsetLeft;
    offsetY = e.clientY - browserWindow.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        browserWindow.style.left = `${e.clientX - offsetX}px`;
        browserWindow.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

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

// Function to start chaotic effects by opening windows with video and sound
let chaosInterval;
let chaosCount = 0;

function startChaos() {
    // Disable scrolling
    document.body.classList.add('no-scroll');

    // Play chaos sound
    if (chaosSound) {
        chaosSound.play();
    }

    // Start the chaos by spawning windows rapidly
    chaosInterval = setInterval(() => {
        createChaosWindow();
        chaosCount++;

        // Escalate the chaos by increasing spawn rate
        if (chaosCount === 20) {
            clearInterval(chaosInterval);
            chaosInterval = setInterval(createChaosWindow, 200);
        } else if (chaosCount === 50) {
            clearInterval(chaosInterval);
            chaosInterval = setInterval(createChaosWindow, 100);
        }
    }, 500);

    // Stop the chaos after a certain time or based on user interaction
    setTimeout(() => {
        endChaos();
    }, 60000); // Chaos lasts for 60 seconds

    // Allow user to end the chaos with a key combination
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'X') {
            endChaos();
        }
    });
}

function createChaosWindow() {
    const chaosWindow = window.open('', '_blank', 'width=400,height=300');

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
                        background-color: black;
                        overflow: hidden;
                    }
                    video {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                </style>
            </head>
            <body>
                <video autoplay loop>
                    <source src="chaosvid.mp4" type="video/mp4">
                </video>
                <audio autoplay loop>
                    <source src="chaossound.mp3" type="audio/mpeg">
                </audio>
            </body>
            </html>
        `);

        // Move the window to a random position after a short delay
        setTimeout(() => {
            const x = Math.floor(Math.random() * (screen.width - 400));
            const y = Math.floor(Math.random() * (screen.height - 300));
            chaosWindow.moveTo(x, y);
        }, 1000);

        // Close the window after a random time between 5-15 seconds
        setTimeout(() => {
            chaosWindow.close();
        }, Math.random() * 10000 + 5000);
    } else {
        console.warn('Pop-up blocked. Please allow pop-ups for this site to enable the chaos effect.');
        endChaos(); // End chaos if pop-ups are blocked
    }
}

function endChaos() {
    // Clear all intervals by resetting the chaos effect
    clearInterval(chaosInterval);
    chaosCount = 0;

    // Remove no-scroll class
    document.body.classList.remove('no-scroll');

    // Stop sound
    if (chaosSound) {
        chaosSound.pause();
        chaosSound.currentTime = 0;
    }

    alert('The chaos has ended! Check your Telegram for further instructions.');
}
