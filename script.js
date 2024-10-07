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
  let chaosDuration = 100 * 60 * 60; // 100 hours in seconds
  let countdownTimer = chaosDuration;

  // Play sound effect (if desired)
  const chaosSound = document.getElementById('chaosSound');
  if (chaosSound) {
    chaosSound.play();
  }

  // Disable scrolling
  document.body.classList.add('no-scroll');

  // Start animated background
  document.body.style.animation = 'backgroundChaos 5s infinite';

  // Show countdown timer
  const countdownElement = document.getElementById('countdown');
  const countdownTimerElement = document.getElementById('countdownTimer');
  countdownElement.style.display = 'block';

  const countdownInterval = setInterval(() => {
    countdownTimer--;
    if (countdownTimer <= 0) {
      clearInterval(countdownInterval);
      endChaos();
      return;
    }
    // Convert seconds to hours
    const hours = Math.floor(countdownTimer / 3600);
    const minutes = Math.floor((countdownTimer % 3600) / 60);
    const seconds = countdownTimer % 60;
    countdownTimerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);

  // Function to spawn new windows
  function spawnNewWindow() {
    const newWindow = document.createElement('div');
    newWindow.classList.add('window', 'chaos-window');
    newWindow.innerHTML = `
      <div class="window-title-bar">
        <div class="window-title">Surprise!</div>
        <div class="window-controls">
          <div class="window-control minimize"></div>
          <div class="window-control maximize"></div>
          <div class="window-control close"></div>
        </div>
      </div>
      <div class="window-content">
        <p>Enjoy the chaos!</p>
      </div>
    `;
    document.body.appendChild(newWindow);
    chaosWindows.push(newWindow);

    // Randomize window size and background color
    newWindow.style.width = Math.random() * 200 + 100 + 'px';
    newWindow.style.height = Math.random() * 150 + 100 + 'px';
    newWindow.style.backgroundColor = getRandomColor();

    moveWindow(newWindow);
  }

  // Function to randomly move a window
  function moveWindow(windowElement) {
    windowElement.style.position = 'absolute';
    windowElement.style.zIndex = 1000;
    const moveSpeed = Math.random() * 200 + 100; // Random speed between 100ms and 300ms

    const windowMovementInterval = setInterval(() => {
      windowElement.style.left = Math.random() * (window.innerWidth - windowElement.offsetWidth) + 'px';
      windowElement.style.top = Math.random() * (window.innerHeight - windowElement.offsetHeight) + 'px';
    }, moveSpeed);

    // Store the interval so it can be cleared later
    windowElement.movementInterval = windowMovementInterval;
  }

  // Function to get a random color
  function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  // Move the original window fast
  const originalWindow = document.getElementById('window');
  moveWindow(originalWindow);

  // Ramp up the craziness by spawning more windows
  chaosInterval = setInterval(() => {
    moveWindow(originalWindow);
  }, 300); // Speed up the movement

  // Start spawning windows
  spawnInterval = setInterval(spawnNewWindow, 1500); // New window every 1.5 seconds

  // Escalating chaos: speed up window movement and spawn more windows faster
  setTimeout(() => {
    clearInterval(chaosInterval);
    clearInterval(spawnInterval);

    chaosInterval = setInterval(() => {
      moveWindow(originalWindow);
      chaosWindows.forEach(window => moveWindow(window));
    }, 100); // Increase speed of movement

    spawnInterval = setInterval(spawnNewWindow, 800); // Faster window spawning
  }, 360000); // After 100 hours, the chaos gets crazier

  // Function to end the chaos
  function endChaos() {
    // Stop all intervals
    clearInterval(chaosInterval);
    clearInterval(spawnInterval);
    clearInterval(countdownInterval);

    // Remove chaos windows and clear their movement intervals
    chaosWindows.forEach(window => {
      clearInterval(window.movementInterval);
      window.remove();
    });
    chaosWindows = [];

    // Stop moving the original window
    clearInterval(originalWindow.movementInterval);
    originalWindow.style.position = 'static';

    // Stop animated background
    document.body.style.animation = '';

    // Enable scrolling
    document.body.classList.remove('no-scroll');

    // Hide countdown timer
    countdownElement.style.display = 'none';

    // Display a surprise message or animation
    alert('The chaos has ended! Thank you for your patience.');

    // Optionally, redirect to another page or display additional content
  }

  // Optional: Allow the user to end the chaos early by pressing a key combination (e.g., Ctrl + Shift + X)
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
      endChaos();
    }
  });
}
