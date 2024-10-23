// Replace with your backend URL
const backendUrl = 'https://telegram-dpreferral-backend.onrender.com'; // Update this to your actual backend URL

// Elements
const claimButton = document.getElementById('claimButton');
const claimMessage = document.getElementById('claimMessage');
const chaosSound = document.getElementById('chaosSound');
const claimModal = document.getElementById('claimModal');
const closeModalButton = document.getElementById('closeModal');
const submitUsernameButton = document.getElementById('submitUsername');
const telegramUsernameInput = document.getElementById('telegramUsername');
const modalMessage = document.getElementById('modalMessage');
const mainContent = document.querySelector('.main-content');
const browserWindow = document.getElementById('browserWindow');
const minimizeButton = document.querySelector('.control-button.minimize');
const maximizeButton = document.querySelector('.control-button.maximize');
const closeButton = document.querySelector('.control-button.close');

// Handle Claim Button Click
claimButton.addEventListener('click', () => {
  openModal();
});

// Close Modal when 'x' is clicked
closeModalButton.addEventListener('click', () => {
  closeModalFunction();
});

// Close Modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target == claimModal) {
    closeModalFunction();
  }
});

// Handle Submit Username
submitUsernameButton.addEventListener('click', async () => {
  const telegramUsername = telegramUsernameInput.value.trim();

  if (!telegramUsername) {
    displayModalMessage('Please enter your Telegram username.', 'error');
    return;
  }

  // Basic validation for Telegram username
  if (!/^@?[a-zA-Z0-9_]{5,32}$/.test(telegramUsername)) {
    displayModalMessage('Invalid Telegram username format.', 'error');
    return;
  }

  // Disable input and button to prevent multiple submissions
  telegramUsernameInput.disabled = true;
  submitUsernameButton.disabled = true;
  submitUsernameButton.textContent = 'Verifying...';

  try {
    const response = await fetch(`${backendUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramUsername }),
    });

    const data = await response.json();

    if (data.success) {
      closeModalFunction();
      displayReferralSection(data.referralCode);
    } else {
      displayModalMessage(data.message || 'Verification failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    displayModalMessage('An error occurred during verification. Please try again.', 'error');
  } finally {
    // Re-enable input and button
    telegramUsernameInput.disabled = false;
    submitUsernameButton.disabled = false;
    submitUsernameButton.textContent = 'Submit';
  }
});

// Display messages in the modal
function displayModalMessage(message, type) {
  modalMessage.textContent = message;
  modalMessage.className = type; // 'error' or 'success'
}

// Open Modal
function openModal() {
  claimModal.style.display = 'block';
  telegramUsernameInput.value = '';
  modalMessage.textContent = '';
  telegramUsernameInput.focus();
}

// Close Modal
function closeModalFunction() {
  claimModal.style.display = 'none';
}

// Display Referral Section
function displayReferralSection(referralCode) {
  mainContent.innerHTML = `
    <h1>Thank You for Verifying!</h1>
    <div class="referral-section">
      <p>Your referral link:</p>
      <div class="referral-link">
        <input type="text" id="referralLink" value="https://knckd.github.io/telegram-dpreferral-frontend/?referralCode=${referralCode}" readonly aria-label="Referral Link">
        <button id="copyButton" class="copy-button">Copy</button>
      </div>
    </div>
    <p id="claimMessage" aria-live="polite"></p>
  `;

  // Add event listener for copy button
  const copyButton = document.getElementById('copyButton');
  const referralLinkInput = document.getElementById('referralLink');

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(referralLinkInput.value)
      .then(() => {
        alert('Referral link copied to clipboard!');
        // Start chaotic effects
        startChaos();
        // Notify the backend of chaos starting
        notifyBackendOfChaos();
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        alert('Failed to copy the referral link. Please try manually.');
      });
  });
}

// Notify backend about chaos initiation
async function notifyBackendOfChaos() {
  try {
    await fetch(`${backendUrl}/api/startChaos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Chaos started!' }),
    });
    console.log('Chaos event logged.');
  } catch (error) {
    console.error('Error logging chaos event:', error);
  }
}

// Tab functionality - Handle tab close
const tabCloseButtons = document.querySelectorAll('.tab-close');

tabCloseButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent triggering tab click
    const tab = event.target.parentElement;
    tab.remove();

    // If the removed tab was active, set the first tab as active
    const remainingTabs = document.querySelectorAll('.tab');
    if (tab.classList.contains('active') && remainingTabs.length > 0) {
      remainingTabs[0].classList.add('active');
    }
  });
});

// Window Control Buttons Functionality

// Minimize Button
minimizeButton.addEventListener('click', () => {
  browserWindow.style.display = 'none';
  createMinimizedBar();
});

// Maximize Button
let isMaximized = false;
maximizeButton.addEventListener('click', () => {
  if (!isMaximized) {
    browserWindow.style.width = '100%';
    browserWindow.style.height = '100%';
    browserWindow.style.top = '0';
    browserWindow.style.left = '0';
    browserWindow.style.transform = 'none';
    isMaximized = true;
    maximizeButton.textContent = '❐'; // Restore icon
    maximizeButton.title = 'Restore';
  } else {
    browserWindow.style.width = '800px';
    browserWindow.style.height = '600px';
    browserWindow.style.top = '50%';
    browserWindow.style.left = '50%';
    browserWindow.style.transform = 'translate(-50%, -50%)';
    isMaximized = false;
    maximizeButton.textContent = '□'; // Maximize icon
    maximizeButton.title = 'Maximize';
  }
});

// Close Button
closeButton.addEventListener('click', () => {
  browserWindow.style.display = 'none';
  removeMinimizedBar();
});

// Create Minimized Bar
function createMinimizedBar() {
  let minimizedBar = document.getElementById('minimizedBar');
  if (!minimizedBar) {
    minimizedBar = document.createElement('div');
    minimizedBar.id = 'minimizedBar';
    minimizedBar.className = 'minimized-bar';
    minimizedBar.textContent = 'Double Penis Token';
    minimizedBar.addEventListener('click', () => {
      browserWindow.style.display = 'flex';
      minimizedBar.remove();
    });
    document.body.appendChild(minimizedBar);
  }
}

// Remove Minimized Bar
function removeMinimizedBar() {
  const minimizedBar = document.getElementById('minimizedBar');
  if (minimizedBar) {
    minimizedBar.remove();
  }
}

// Make the browser window draggable
let isDragging = false;
let offsetX, offsetY;

const windowHeader = document.querySelector('.window-header');

windowHeader.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - browserWindow.offsetLeft;
  offsetY = e.clientY - browserWindow.offsetTop;
  browserWindow.style.transition = 'none';
});

window.addEventListener('mousemove', (e) => {
  if (isDragging && !isMaximized) {
    browserWindow.style.left = `${e.clientX - offsetX}px`;
    browserWindow.style.top = `${e.clientY - offsetY}px`;
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  browserWindow.style.transition = 'all 0.3s ease';
});

// Function to start chaotic effects by duplicating browser windows
let chaosInterval;
let chaosCount = 0;

function startChaos() {
  // Play sound effect if available
  if (chaosSound) {
    chaosSound.play();
  }

  // Disable scrolling
  document.body.classList.add('no-scroll');

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
  const chaosWindow = window.open('', '_blank', 'width=300,height=200');

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
            background-color: yellow;
            color: black;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }
          h1 {
            font-size: 14px;
            animation: shake 0.5s infinite;
            text-align: center;
          }
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
        </style>
      </head>
      <body>
        <h1>You are an idiot!</h1>
      </body>
      </html>
    `);

    // Move the window to a random position after a short delay
    setTimeout(() => {
      const x = Math.floor(Math.random() * (screen.width - 300));
      const y = Math.floor(Math.random() * (screen.height - 200));
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

  alert('The chaos has ended!');
}
