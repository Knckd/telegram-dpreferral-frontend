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

// Function to start chaotic effects (enhanced chaos behavior)
function startChaos() {
  let chaosWindows = [];
  let chaosCount = 0;
  let chaosInterval;

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

  function createChaosWindow() {
    const chaosWindow = document.createElement('div');
    chaosWindow.classList.add('window', 'chaos-window');
    chaosWindow.innerHTML = `
      <div class="window-title-bar">
        <div class="window-title">You Are an Idiot!</div>
        <div class="window-controls">
          <div class="window-control close">✕</div>
        </div>
      </div>
      <div class="window-content">
        <p>You are an idiot!</p>
      </div>
    `;

    // Randomize position
    chaosWindow.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    chaosWindow.style.top = Math.random() * (window.innerHeight - 100) + 'px';

    // Randomize background color
    chaosWindow.style.backgroundColor = getRandomColor();

    document.body.appendChild(chaosWindow);
    chaosWindows.push(chaosWindow);

    // Make window draggable and moving
    makeDraggable(chaosWindow);
    moveWindow(chaosWindow);

    // Close button functionality
    const closeButton = chaosWindow.querySelector('.window-control.close');
    closeButton.addEventListener('click', () => {
      chaosWindow.remove();
    });
  }

  function moveWindow(windowElement) {
    const speed = Math.random() * 3000 + 2000; // Random speed between 2000ms and 5000ms
    windowElement.movementInterval = setInterval(() => {
      windowElement.style.left = Math.random() * (window.innerWidth - 200) + 'px';
      windowElement.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    }, speed);
  }

  function endChaos() {
    chaosWindows.forEach(window => {
      clearInterval(window.movementInterval);
      window.remove();
    });
    chaosWindows = [];

    document.body.classList.remove('no-scroll');

    if (chaosSound) {
      chaosSound.pause();
      chaosSound.currentTime = 0;
    }

    alert('The chaos has ended!');
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
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
  const minimizeButton = mainWindow.querySelector('.window-control minimize');
  const maximizeButton = mainWindow.querySelector('.window-control maximize');
  const closeButton = mainWindow.querySelector('.window-control close');

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
