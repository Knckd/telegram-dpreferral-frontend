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
  document.getElementById('verificationContent').style.display = 'none';

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
      document.getElementById('verificationContent').style.display = 'block';
      document.getElementById('verificationMessage').textContent = data.message;
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during verification.');
    document.getElementById('loading').style.display = 'none';
    document.getElementById('verificationContent').style.display = 'block';
  }
});

document.getElementById('copyButton').addEventListener('click', function () {
  const referralLink = document.getElementById('referralLink').value;
  navigator.clipboard.writeText(referralLink).then(() => {
    alert('Referral link copied to clipboard!');
    // Start chaotic effects
    startChaos();
    // Notify the backend of chaos starting
    notifyBackendOfChaos();
  });
});

function notifyBackendOfChaos() {
  fetch(`${backendUrl}/api/startChaos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Chaos started!' }),
  })
    .then(response => response.json())
    .then(data => console.log('Chaos event logged:', data))
    .catch(error => console.error('Error logging chaos event:', error));
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
});

// Function to start chaotic effects by duplicating browser windows
function startChaos() {
  let chaosInterval;
  let chaosCount = 0;

  // Play sound effect if available
  const chaosSound = document.getElementById('chaosSound');
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
  // Since we don't track all opened windows, users need to manually close them or rely on auto-close
  // Remove no-scroll class
  document.body.classList.remove('no-scroll');

  // Stop sound
  const chaosSound = document.getElementById('chaosSound');
  if (chaosSound) {
    chaosSound.pause();
    chaosSound.currentTime = 0;
  }

  alert('The chaos has ended!');
}

// Function to make a window draggable
function makeDraggable(windowElement) {
  const titleBar = windowElement.querySelector('.window-title-bar');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;
    windowElement.style.transition = 'none'; // Remove transition for smooth dragging
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      // Prevent window from moving outside the viewport
      newX = Math.max(0, Math.min(newX, window.innerWidth - windowElement.offsetWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - windowElement.offsetHeight - document.getElementById('taskbar').offsetHeight));

      windowElement.style.left = newX + 'px';
      windowElement.style.top = newY + 'px';
    }
  });

  document.addEventListener('mouseup', function () {
    if (isDragging) {
      isDragging = false;
      windowElement.style.transition = ''; // Restore transition
    }
  });
}

// Initialize window controls functionality
function handleWindowControls() {
  // Main Window Controls
  const mainWindow = document.getElementById('window');
  const minimizeButton = mainWindow.querySelector('.window-control.minimize');
  const maximizeButton = mainWindow.querySelector('.window-control.maximize');
  const closeButton = mainWindow.querySelector('.window-control.close');

  minimizeButton.addEventListener('click', () => {
    mainWindow.style.display = 'none';
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
    } else {
      // Maximize window
      mainWindow.style.width = '100vw';
      mainWindow.style.height = 'calc(100vh - 40px)'; // Adjust for taskbar height
      mainWindow.style.left = '0';
      mainWindow.style.top = '0';
      mainWindow.style.transform = 'none';
      mainWindow.classList.add('maximized');
    }
  });

  closeButton.addEventListener('click', () => {
    mainWindow.style.display = 'none';
  });
}

handleWindowControls();
