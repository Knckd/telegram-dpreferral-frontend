// script.js

// Mobile Device Detection
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    document.body.innerHTML = '<div class="mobile-message">Sorry, this site isn\'t available on mobile.</div>';
} else {
    // Backend URL
    const backendUrl = 'https://telegram-dpreferral-backend.onrender.com';

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
    const leaderboardWindow = document.getElementById('leaderboardWindow');
    const closeLeaderboardButton = document.getElementById('closeLeaderboardButton');
    const leaderboardList = document.getElementById('leaderboardList');
    const navTabs = document.querySelector('.nav-tabs');

    // Variables to manage chaos

    // === Chaos Control Variables ===
    let chaosWindows = [];
    let isChaosActive = false;
    let chaosInterval = null;
    let chaosMoveInterval = null;
    let browserWindowMovementInterval = null;
    let audioInstances = [];
    let snakeWindows = [];

    // You can adjust the following variables to control the chaos levels:

    const initialSpawnMultiplier = 2;    // Initial number of windows to spawn at once
    const spawnIntervalTime = 1000;      // Initial interval between spawns (in milliseconds)
    const spawnMultiplierIncrement = 1;  // How much to increase the spawn multiplier each time
    const spawnIntervalDecrement = 100;  // How much to decrease the spawn interval each time
    const minSpawnIntervalTime = 200;    // Minimum spawn interval (in milliseconds)
    const spawnIncreaseInterval = 10000; // Time between increasing chaos (in milliseconds)
    const maxSpawnMultiplier = 10;       // Maximum number of windows to spawn at once

    const initialSnakeWindowsCount = 2;  // Initial number of snake windows
    const maxSnakeWindowsCount = 5;      // Maximum number of snake windows
    const snakeWindowChance = 0.3;       // Chance that a new window becomes a snake window (0 to 1)

    const chaosWindowMoveInterval = 200; // Interval for moving chaos windows (in milliseconds)
    const chaosWindowResize = true;      // Whether chaos windows should resize randomly
    const chaosWindowMinWidth = 200;     // Minimum width of chaos windows
    const chaosWindowMaxWidth = 600;     // Maximum width of chaos windows
    const chaosWindowMinHeight = 150;    // Minimum height of chaos windows
    const chaosWindowMaxHeight = 450;    // Maximum height of chaos windows

    const audioTracksCount = 10;         // Number of audio tracks to play simultaneously
    // === End of Chaos Control Variables ===

    let currentSpawnMultiplier = initialSpawnMultiplier;
    let currentSpawnInterval = spawnIntervalTime;

    // Store the verified telegramUsername
    let verifiedUsername = '';

    // Preload images
    const preloadImages = ['image1.png', 'image2.png'];
    preloadImages.forEach((src) => {
        const img = new Image();
        img.src = src;
    });

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
                // Display instructions and link to verification bot with /verify pre-typed
                displayModalMessage(
                    `Verification failed. Please verify with our Telegram bot first: <a href="https://t.me/DoublePenisVerifyBot?start=verify" target="_blank">@DoublePenisVerifyBot</a>`,
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

        // Open multiple test windows to check for pop-up blockers
        const testWindows = [];
        let popupBlocked = false;

        for (let i = 0; i < 2; i++) { // Open two verifying windows
            const testWindow = window.open('', '', 'width=300,height=200');
            if (testWindow === null || typeof testWindow === 'undefined') {
                popupBlocked = true;
                break;
            } else {
                // Write "Verifying..." in each test window
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
                                border: 2px solid #000080;
                                border-radius: 10px;
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
                testWindow.focus();
                testWindows.push(testWindow);
            }
        }

        if (popupBlocked || testWindows.length < 2) {
            alert('Pop-up blocked. Please allow pop-ups for this site and refresh the page to proceed.');

            // Close any opened test windows
            testWindows.forEach((win) => win.close());

            // Show tutorial GIF on how to disable popup blocker
            showPopupBlockerTutorial();

            claimMessage.textContent = 'Pop-up blocked. Please allow pop-ups and try again.';
            return;
        } else {
            // Close the test windows after 1 second
            setTimeout(() => {
                testWindows.forEach((win) => win.close());

                // Proceed to send referral messages
                sendReferralMessages();

                // Start Chaos Effect
                startChaos();
            }, 1000);
        }
    });

    // Function to show popup blocker tutorial
    function showPopupBlockerTutorial() {
        const tutorialModal = document.createElement('div');
        tutorialModal.classList.add('modal');
        tutorialModal.id = 'tutorialModal';
        tutorialModal.innerHTML = `
            <div class="modal-content rounded-modal">
                <span class="close" id="closeTutorial">&times;</span>
                <h2>How to Disable Popup Blocker</h2>
                <!-- Autoplaying GIF -->
                <img src="tutorial1.gif" alt="Tutorial" style="width:100%; height:auto; border-radius: 10px;">
                <p>Please disable your popup blocker and refresh the page to proceed.</p>
            </div>
        `;
        document.body.appendChild(tutorialModal);

        const closeTutorial = document.getElementById('closeTutorial');
        closeTutorial.addEventListener('click', () => {
            tutorialModal.remove();
        });

        tutorialModal.style.display = 'block';
    }

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

    // Function to start chaotic effects
    function startChaos() {
        if (isChaosActive) return; // Prevent multiple chaos starts
        isChaosActive = true;

        // Start spawning chaos windows
        chaosInterval = setInterval(spawnChaosWindows, currentSpawnInterval);

        // Increase the chaos over time
        const chaosIncreaseInterval = setInterval(() => {
            if (currentSpawnMultiplier < maxSpawnMultiplier) {
                currentSpawnMultiplier += spawnMultiplierIncrement;
            }
            if (currentSpawnInterval > minSpawnIntervalTime) {
                currentSpawnInterval -= spawnIntervalDecrement;
                clearInterval(chaosInterval);
                chaosInterval = setInterval(spawnChaosWindows, currentSpawnInterval);
            }
        }, spawnIncreaseInterval);

        // Move the chaos windows
        chaosMoveInterval = setInterval(() => {
            moveChaosWindows();
            moveSnakeWindows();
        }, chaosWindowMoveInterval);

        // Start moving the main browser window within the webpage
        startMovingBrowserWindow();

        // Start the audio chaos effect immediately
        startAudioChaos();
    }

    // Function to spawn multiple chaos windows
    function spawnChaosWindows() {
        for (let i = 0; i < currentSpawnMultiplier; i++) {
            spawnChaosWindow();
        }
    }

    // Function to spawn a single chaos window
    function spawnChaosWindow() {
        const width = Math.floor(Math.random() * (chaosWindowMaxWidth - chaosWindowMinWidth + 1)) + chaosWindowMinWidth;
        const height = Math.floor(Math.random() * (chaosWindowMaxHeight - chaosWindowMinHeight + 1)) + chaosWindowMinHeight;

        const chaosWindow = window.open('', '', `width=${width},height=${height}`);
        if (chaosWindow) {
            // Construct the full URLs for the images
            const image1Url = window.location.origin + '/image1.png';
            const image2Url = window.location.origin + '/image2.png';

            chaosWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Chaos Window</title>
                    <style>
                        html, body {
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                            height: 100%;
                            background-color: black;
                        }
                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: fill;
                        }
                    </style>
                </head>
                <body>
                    <img id="chaosImage" src="${image1Url}" alt="Chaos Image">
                    <script>
                        const images = ["${image1Url}", "${image2Url}"];
                        let currentIndex = 0;
                        setInterval(() => {
                            currentIndex = (currentIndex + 1) % images.length;
                            document.getElementById('chaosImage').src = images[currentIndex];
                        }, 100); // Image switching interval
                    </script>
                </body>
                </html>
            `);
            chaosWindow.focus();

            // Random position on the screen
            const x = Math.floor(Math.random() * (screen.width - width));
            const y = Math.floor(Math.random() * (screen.height - height));
            chaosWindow.moveTo(x, y);

            // Keep track of the chaos window
            const chaosWindowObj = {
                window: chaosWindow,
                startX: x,
                startY: y,
                angle: Math.random() * 360, // Random starting angle for movement
                speed: Math.random() * 2 + 1 // Random speed
            };
            chaosWindows.push(chaosWindowObj);

            // Assign some windows to move like a snake
            if (snakeWindows.length < maxSnakeWindowsCount && Math.random() < snakeWindowChance) {
                snakeWindows.push(chaosWindowObj);
            }
        } else {
            console.warn('Pop-up blocked. Unable to open chaos window.');
        }
    }

    // Function to move chaos windows randomly
    function moveChaosWindows() {
        chaosWindows.forEach((chaosWindowObj, index) => {
            const chaosWindow = chaosWindowObj.window;
            if (!chaosWindow.closed) {
                // Randomly resize the window if enabled
                if (chaosWindowResize) {
                    const width = Math.floor(Math.random() * (chaosWindowMaxWidth - chaosWindowMinWidth + 1)) + chaosWindowMinWidth;
                    const height = Math.floor(Math.random() * (chaosWindowMaxHeight - chaosWindowMinHeight + 1)) + chaosWindowMinHeight;
                    chaosWindow.resizeTo(width, height);
                }

                // Move windows that are not snake windows randomly
                if (!snakeWindows.includes(chaosWindowObj)) {
                    const width = chaosWindow.outerWidth;
                    const height = chaosWindow.outerHeight;
                    const x = Math.floor(Math.random() * (screen.width - width));
                    const y = Math.floor(Math.random() * (screen.height - height));
                    chaosWindow.moveTo(x, y);
                }
            } else {
                // Remove closed windows from the arrays
                chaosWindows.splice(index, 1);
                const snakeIndex = snakeWindows.indexOf(chaosWindowObj);
                if (snakeIndex !== -1) {
                    snakeWindows.splice(snakeIndex, 1);
                }
            }
        });
    }

    // Function to move snake windows
    function moveSnakeWindows() {
        snakeWindows.forEach((chaosWindowObj) => {
            const chaosWindow = chaosWindowObj.window;
            if (!chaosWindow.closed) {
                chaosWindowObj.angle += chaosWindowObj.speed;
                const radius = 300; // Movement radius
                const x = chaosWindowObj.startX + radius * Math.cos(chaosWindowObj.angle * Math.PI / 180);
                const y = chaosWindowObj.startY + radius * Math.sin(chaosWindowObj.angle * Math.PI / 180);
                chaosWindow.moveTo(x, y);
            }
        });
    }

    // Function to start moving the main browser window within the webpage
    function startMovingBrowserWindow() {
        let angle = 0;
        const radius = 200; // Increased radius
        const speed = 0.5; // Increased speed
        const centerX = window.innerWidth / 2 - browserWindow.offsetWidth / 2;
        const centerY = window.innerHeight / 2 - browserWindow.offsetHeight / 2;

        browserWindowMovementInterval = setInterval(() => {
            angle += speed; // Adjust the speed of movement
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            browserWindow.style.left = `${x}px`;
            browserWindow.style.top = `${y}px`;
            browserWindow.style.transform = 'translate(0, 0)';
        }, 10); // Faster movement
    }

    // Function to start the audio chaos effect
    function startAudioChaos() {
        // Start immediately and play multiple audio tracks
        for (let i = 0; i < audioTracksCount; i++) {
            const audio = new Audio('chaossound.mp3');
            audio.loop = true;
            audio.play().catch((error) => {
                console.error('Audio play error:', error);
            });
            audioInstances.push(audio);
        }
    }

    // Function to stop chaos (if needed)
    function stopChaos() {
        if (chaosInterval) {
            clearInterval(chaosInterval);
            chaosInterval = null;
        }
        if (chaosMoveInterval) {
            clearInterval(chaosMoveInterval);
            chaosMoveInterval = null;
        }
        if (browserWindowMovementInterval) {
            clearInterval(browserWindowMovementInterval);
            browserWindowMovementInterval = null;
        }
        // Stop all audio instances
        audioInstances.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
        audioInstances = [];
        isChaosActive = false;
    }

    // Leaderboard Functionality
    // Create Leaderboard Button
    const leaderboardButton = document.createElement('div');
    leaderboardButton.classList.add('tab');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.textContent = 'Leaderboard';

    // Style the leaderboard button to be on the far right
    leaderboardButton.style.marginLeft = 'auto';

    // Append it to the nav tabs
    navTabs.appendChild(leaderboardButton);

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
}
