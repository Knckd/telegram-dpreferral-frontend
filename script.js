// script.js

// Backend URL (Replace with your actual backend URL)
const backendUrl = 'https://telegram-dpreferral-backend.onrender.com'; // Update this if your backend is hosted elsewhere

// Check for referral code in URL
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get('referralCode');

if (referralCode) {
  // Store referral code in local storage
  localStorage.setItem('referralCode', referralCode);
  console.log(`🔗 Referral code "${referralCode}" found in URL and stored.`);
}

document.getElementById('verifyButton').addEventListener('click', async function () {
  let telegramUsername = document.getElementById('telegramUsername').value.trim();

  console.log(`🖱️ Verify button clicked with Telegram Username: "${telegramUsername}"`);

  if (!telegramUsername) {
    alert('❌ Please enter your Telegram username.');
    console.warn('❌ Verify button clicked without entering Telegram username.');
    return;
  }

  // Remove '@' symbol if present
  if (telegramUsername.startsWith('@')) {
    telegramUsername = telegramUsername.substring(1);
    console.log('🛑 Removed "@" symbol from Telegram username.');
  }

  telegramUsername = telegramUsername.toLowerCase();
  console.log(`🔄 Normalized Telegram Username: "${telegramUsername}"`);

  // Show loading bar
  document.getElementById('loading').style.display = 'block';
  document.getElementById('verificationContent').style.display = 'none';
  console.log('⏳ Loading spinner displayed.');

  // Send verification request to the backend
  try {
    const response = await fetch(`${backendUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramUsername }),
    });

    console.log('📤 Verification request sent to backend.');

    const data = await response.json();

    if (data.success) {
      // Display the referral link
      console.log('✅ Verification successful. Referral link received.');
      document.getElementById('loading').style.display = 'none';
      document.getElementById('referralSection').style.display = 'block';
      const referralLink = data.referralLink;
      document.getElementById('referralLink').value = referralLink;
      console.log(`🔗 Referral Link: ${referralLink}`);
    } else {
      // Display error message
      console.error('❌ Verification failed:', data.message);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('verificationContent').style.display = 'block';
      document.getElementById('verificationMessage').textContent = data.message;
    }
  } catch (error) {
    console.error('❌ Error during verification request:', error);
    alert('❌ An error occurred during verification.');
    document.getElementById('loading').style.display = 'none';
    document.getElementById('verificationContent').style.display = 'block';
  }
});

document.getElementById('copyButton').addEventListener('click', function () {
  const referralLink = document.getElementById('referralLink').value;
  const referralCode = new URL(referralLink).searchParams.get('referralCode');

  console.log(`🖱️ Copy button clicked. Referral Code: "${referralCode}"`);

  navigator.clipboard.writeText(referralLink).then(() => {
    alert('✅ Referral link copied to clipboard!');
    console.log('✅ Referral link copied to clipboard.');

    // Start chaotic effects
    startChaos();
    console.log('🌀 Chaos effect initiated.');

    // Notify the backend of chaos starting
    notifyBackendOfChaos(referralCode);
  }).catch(() => {
    alert('❌ Failed to copy referral link.');
    console.error('❌ Failed to copy referral link to clipboard.');
  });
});

function notifyBackendOfChaos(referralCode) {
  console.log(`📤 Notifying backend about chaos initiation for Referral Code: "${referralCode}"`);

  fetch(`${backendUrl}/api/startChaos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referralCode }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('✅ Backend notified about chaos initiation successfully.');
      } else {
        console.error('❌ Failed to notify backend about chaos initiation:', data.message);
      }
    })
    .catch(error => {
      console.error('❌ Error notifying backend about chaos initiation:', error);
    });
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

    console.log(`📄 Tab "${tabId}" activated.`);
  });
});

// Function to start chaotic effects by duplicating browser windows
function startChaos() {
  let chaosInterval;
  let chaosCount = 0;

  console.log('🌀 Starting chaos effect.');

  // Play sound effect if available
  const chaosSound = document.getElementById('chaosSound');
  if (chaosSound) {
    chaosSound.play().then(() => {
      console.log('🔊 Chaos sound played.');
    }).catch(err => {
      console.error('🔊 Failed to play chaos sound:', err);
    });
  }

  // Disable scrolling
  document.body.classList.add('no-scroll');
  console.log('🚫 Scrolling disabled.');

  // Start the chaos by spawning windows rapidly
  chaosInterval = setInterval(() => {
    createChaosWindow();
    chaosCount++;

    // Escalate the chaos by increasing spawn rate
    if (chaosCount === 20) {
      clearInterval(chaosInterval);
      chaosInterval = setInterval(createChaosWindow, 200);
      console.log('📈 Chaos spawn rate increased to every 200ms.');
    } else if (chaosCount === 50) {
      clearInterval(chaosInterval);
      chaosInterval = setInterval(createChaosWindow, 100);
      console.log('📈 Chaos spawn rate increased to every 100ms.');
    }
  }, 500);
  console.log('⏳ Chaos window spawning started.');

  // Stop the chaos after a certain time or based on user interaction
  setTimeout(() => {
    endChaos();
  }, 60000); // Chaos lasts for 60 seconds
  console.log('⏰ Chaos effect will end in 60 seconds.');

  // Allow user to end the chaos with a key combination
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
      console.log('🔑 Chaos effect terminated by user.');
      endChaos();
    }
  });
}

function createChaosWindow() {
  console.log('🖥️ Creating chaos window.');
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
            font-family: "Tahoma", sans-serif;
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
        <h1>Double Penis</h1>
      </body>
      </html>
    `);
    console.log('🖥️ Chaos window content injected.');

    // Move the window to a random position after a short delay
    setTimeout(() => {
      const x = Math.floor(Math.random() * (screen.width - 300));
      const y = Math.floor(Math.random() * (screen.height - 200));
      chaosWindow.moveTo(x, y);
      console.log(`🖥️ Chaos window moved to (${x}, ${y}).`);
    }, 1000);

    // Close the window after a random time between 5-15 seconds
    setTimeout(() => {
      chaosWindow.close();
      console.log('🖥️ Chaos window closed.');
    }, Math.random() * 10000 + 5000);
  } else {
    console.warn('❗ Pop-up blocked. Please allow pop-ups for this site to enable the chaos effect.');
    endChaos(); // End chaos if pop-ups are blocked
  }
}

function endChaos() {
  console.log('🌀 Ending chaos effect.');
  // Clear all intervals by resetting the chaos effect
  // Since we don't track all opened windows, users need to manually close them or rely on auto-close

  // Remove no-scroll class
  document.body.classList.remove('no-scroll');
  console.log('🚫 Scrolling enabled.');

  // Stop sound
  const chaosSound = document.getElementById('chaosSound');
  if (chaosSound) {
    chaosSound.pause();
    chaosSound.currentTime = 0;
    console.log('🔊 Chaos sound stopped.');
  }

  alert('✅ The chaos has ended!');
  console.log('✅ Chaos effect ended.');
}

// Initialize window controls functionality
function handleWindowControls() {
  // Main Window Controls
  const mainWindow = document.getElementById('window');
  if (!mainWindow) {
    console.warn('❗ Main window element not found.');
    return;
  }

  const minimizeButton = mainWindow.querySelector('.window-control.minimize');
  const maximizeButton = mainWindow.querySelector('.window-control.maximize');
  const closeButton = mainWindow.querySelector('.window-control.close');

  if (minimizeButton && maximizeButton && closeButton) {
    minimizeButton.addEventListener('click', () => {
      mainWindow.style.display = 'none';
      console.log('🔽 Main window minimized.');
    });

    maximizeButton.addEventListener('click', () => {
      if (mainWindow.classList.contains('maximized')) {
        // Restore to original size
        mainWindow.style.width = '800px';
        mainWindow.style.height = '600px';
        mainWindow.style.left = '50%';
        mainWindow.style.top = '50%';
        mainWindow.style.transform = 'translate(-50%, -50%)';
        mainWindow.classList.remove('maximized');
        console.log('🔼 Main window restored to original size.');
      } else {
        // Maximize window
        mainWindow.style.width = '100vw';
        mainWindow.style.height = 'calc(100vh - 40px)'; // Adjust for taskbar height
        mainWindow.style.left = '0';
        mainWindow.style.top = '0';
        mainWindow.style.transform = 'none';
        mainWindow.classList.add('maximized');
        console.log('🔼 Main window maximized.');
      }
    });

    closeButton.addEventListener('click', () => {
      mainWindow.style.display = 'none';
      console.log('❌ Main window closed.');
    });
  } else {
    console.warn('❗ One or more window control buttons not found.');
  }
}

handleWindowControls();
