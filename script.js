// Replace with your backend URL
const backendUrl = 'https://telegram-dpreferral-backend.onrender.com'; // Update this to your actual backend URL

// Check for referral code in URL
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get('referralCode');

if (referralCode) {
  // Store referral code in local storage
  localStorage.setItem('referralCode', referralCode);
}

document.getElementById('verifyButton').addEventListener('click', async function () {
  let telegramUsername = document.getElementById('telegramUsername').value.trim();

  if (!telegramUsername) {
    alert('Please enter your Telegram username.');
    return;
  }

  telegramUsername = telegramUsername.toLowerCase();

  // Show loading bar
  document.getElementById('loading').style.display = 'block';
  document.getElementById('verification').style.display = 'none';

  // Send verification request to the backend
  try {
    const response = await fetch(`${backendUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramUsername }),
    });

    const data = await response.json();

    if (data.success) {
      // Display the referral link
      document.getElementById('loading').style.display = 'none';
      document.getElementById('referralSection').style.display = 'block';
      const referralLink = `https://knckd.github.io/telegram-dpreferral-frontend/?referralCode=${data.referralCode}`;
      document.getElementById('referralLink').value = referralLink;

      // If there's a stored referral code, send it to the backend
      const storedReferralCode = localStorage.getItem('referralCode');

      if (storedReferralCode) {
        fetch(`${backendUrl}/api/referral`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referralCode: storedReferralCode }),
        })
          .then((response) => response.json())
          .then((referralData) => {
            if (referralData.success) {
              console.log('Referral recorded successfully.');
              // Clear the stored referral code
              localStorage.removeItem('referralCode');
            } else {
              console.log('Failed to record referral:', referralData.message);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    } else {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('verification').style.display = 'block';
      document.getElementById('verificationMessage').textContent = data.message;
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during verification.');
    document.getElementById('loading').style.display = 'none';
    document.getElementById('verification').style.display = 'block';
  }
});

document.getElementById('copyButton').addEventListener('click', function () {
  const referralLink = document.getElementById('referralLink').value;
  navigator.clipboard.writeText(referralLink).then(() => {
    alert('Referral link copied to clipboard!');
    // Start chaotic effects
    startChaos();
  });
});

// Function to start chaotic effects
function startChaos() {
  let chaosInterval;
  let spawnInterval;
  let chaosWindows = [];

  // Function to spawn new windows
  function spawnNewWindow() {
    const newWindow = document.createElement('div');
    newWindow.classList.add('window', 'chaos-window');
    newWindow.innerHTML = `
      <div class="window-title-bar">
        <div class="window-title">New Window</div>
        <div class="window-controls">
          <div class="window-control minimize">_</div>
          <div class="window-control maximize">☐</div>
          <div class="window-control close">X</div>
        </div>
      </div>
      <div class="window-content">
        <p>Welcome to the chaos!</p>
      </div>
    `;
    document.body.appendChild(newWindow);
    chaosWindows.push(newWindow);

    moveWindow(newWindow);
  }

  // Function to randomly move a window
  function moveWindow(windowElement) {
    windowElement.style.position = 'absolute';
    const moveSpeed = 200; // Speed of movement
    const windowMovementInterval = setInterval(() => {
      windowElement.style.left = Math.random() * (window.innerWidth - 300) + 'px';
      windowElement.style.top = Math.random() * (window.innerHeight - 200) + 'px';
    }, moveSpeed);
  }

  // Move the original window fast
  const originalWindow = document.getElementById('window');
  moveWindow(originalWindow);

  // Ramp up the craziness by spawning more windows
  chaosInterval = setInterval(() => {
    moveWindow(originalWindow);
  }, 500); // Speed up the movement

  // Start spawning windows
  spawnInterval = setInterval(spawnNewWindow, 2000); // New window every 2 seconds

  // Escalating chaos: speed up window movement and spawn more windows faster
  setTimeout(() => {
    clearInterval(chaosInterval);
    clearInterval(spawnInterval);

    chaosInterval = setInterval(() => {
      moveWindow(originalWindow);
      chaosWindows.forEach(window => moveWindow(window));
    }, 200); // Increase speed of movement

    spawnInterval = setInterval(spawnNewWindow, 1000); // Faster window spawning
  }, 5000); // After 5 seconds, the chaos gets crazier
}
