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

// Leaderboard Button Event Listener
document.getElementById('leaderboardButton').addEventListener('click', function () {
  openLeaderboard();
});

// Function to open the leaderboard window
function openLeaderboard() {
  const leaderboardWindow = document.getElementById('leaderboardWindow');
  leaderboardWindow.style.display = 'block';
  fetchLeaderboard();
  makeDraggable(leaderboardWindow);
}

// Function to fetch and display the leaderboard
function fetchLeaderboard() {
  fetch(`${backendUrl}/api/leaderboard`)
    .then(response => response.json())
    .then(data => {
      const leaderboardList = document.getElementById('leaderboardList');
      leaderboardList.innerHTML = ''; // Clear existing list
      data.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.telegramUsername} - ${user.referralCount} referrals`;
        leaderboardList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching leaderboard:', error);
    });
}

// Function to start chaotic effects
function startChaos() {
  let chaosInterval;
  let spawnInterval;
  let chaosWindows = [];
  const chaosDuration = 100 * 60 * 60; // 100 hours in seconds
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
    // Convert seconds to hours, minutes, and seconds
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
        <div class="window-title">
          <img src="ie-icon.png" alt="IE Icon" class="window-icon">
          Surprise! - Microsoft Internet Explorer
        </div>
        <div class="window-controls">
          <div class="window-control minimize">_</div>
          <div class="window-control maximize">☐</div>
          <div class="window-control close">X</div>
        </div>
      </div>
      <div class="window-content">
        <p>Enjoy the chaos!</p>
      </div>
    `;
    document.body.appendChild(newWindow);
    chaosWindows.push(newWindow);

    // Randomize window size and background color
    newWindow.style.width = Math.random() * 200 + 300 + 'px';
    newWindow.style.height = Math.random() * 150 + 200 + 'px';
    // newWindow.style.backgroundColor = getRandomColor();

    makeDraggable(newWindow);
    moveWindow(newWindow);

    // Add window controls functionality
    const minimizeButton = newWindow.querySelector('.window-control.minimize');
    const maximizeButton = newWindow.querySelector('.window-control.maximize');
    const closeButton = newWindow.querySelector('.window-control.close');

    minimizeButton.addEventListener('click', () => {
      newWindow.style.display = 'none';
    });

    maximizeButton.addEventListener('click', () => {
      if (newWindow.classList.contains('maximized')) {
        // Restore to original size
        newWindow.style.width = '400px';
        newWindow.style.height = '300px';
        newWindow.classList.remove('maximized');
      } else {
        // Maximize window
        newWindow.style.width = '100vw';
        newWindow.style.height = 'calc(100vh - 40px)'; // Adjust for taskbar height
        newWindow.style.left = '0';
        newWindow.style.top = '0';
        newWindow.style.transform = 'none';
        newWindow.classList.add('maximized');
      }
    });

    closeButton.addEventListener('click', () => {
      clearInterval(newWindow.movementInterval);
      newWindow.remove();
    });

    // Open new browser windows in the 'chaos' state
    openChaosBrowser();
  }

  // Function to open new browser windows in the 'chaos' state
  function openChaosBrowser() {
    const newWindow = window.open(window.location.href, '_blank', 'width=600,height=500');
    // Optionally, you can use window features to remove toolbars and menus
  }

  // Function to randomly move a window
  function moveWindow(windowElement) {
    windowElement.style.position = 'absolute';
    windowElement.style.zIndex = 1000;
    const moveSpeed = Math.random() * 3000 + 2000; // Random speed between 2000ms and 5000ms

    const windowMovementInterval = setInterval(() => {
      windowElement.style.left = Math.random() * (window.innerWidth - windowElement.offsetWidth) + 'px';
      windowElement.style.top = Math.random() * (window.innerHeight - windowElement.offsetHeight - document.getElementById('taskbar').offsetHeight) + 'px';
    }, moveSpeed);

    // Store the interval so it can be cleared later
    windowElement.movementInterval = windowMovementInterval;
  }

  // Function to get a random color
  function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  // Make the main window draggable
  const originalWindow = document.getElementById('window');
  makeDraggable(originalWindow);
  moveWindow(originalWindow);

  // Ramp up the craziness by spawning more windows
  chaosInterval = setInterval(() => {
    moveWindow(originalWindow);
  }, 5000); // Adjusted to 5000ms for slower movement

  // Start spawning windows
  spawnInterval = setInterval(spawnNewWindow, 10000); // New window every 10 seconds

  // Escalating chaos: speed up window movement and spawn more windows faster
  setTimeout(() => {
    clearInterval(chaosInterval);
    clearInterval(spawnInterval);

    chaosInterval = setInterval(() => {
      moveWindow(originalWindow);
      chaosWindows.forEach(window => moveWindow(window));
    }, 2000); // Increase speed of movement

    spawnInterval = setInterval(spawnNewWindow, 5000); // Faster window spawning
  }, 60000); // After 1 minute, the chaos escalates

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

    // Hide chaos sound if it's playing
    if (chaosSound) {
      chaosSound.pause();
      chaosSound.currentTime = 0;
    }

    // Return to referral copy section
    document.getElementById('referralSection').scrollIntoView({ behavior: 'smooth' });

    // Display a confirmation message without leaving the screen
    alert('The chaos has ended! Thank you for your patience.');
  }

  // Optional: Allow the user to end the chaos early by pressing a key combination (e.g., Ctrl + Shift + X)
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
      endChaos();
    }
  });
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

// Function to handle window control actions
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
      mainWindow.style.width = '600px';
      mainWindow.style.height = '500px';
      mainWindow.style.left = '50%';
      mainWindow.style.top = '50%';
      mainWindow.style.transform = 'translate(-50%, -50%)';
      mainWindow.classList.remove('maximized');
    } else {
      // Maximize window
      mainWindow.style.width = '100vw';
      mainWindow.style.height = 'calc(100vh - 40px - 30px)'; // Adjust for taskbar and toolbar height
      mainWindow.style.left = '0';
      mainWindow.style.top = '30px'; // Below the toolbar
      mainWindow.style.transform = 'none';
      mainWindow.classList.add('maximized');
    }
  });

  closeButton.addEventListener('click', () => {
    mainWindow.style.display = 'none';
  });

  // Leaderboard Window Controls
  const leaderboardWindow = document.getElementById('leaderboardWindow');
  const leaderboardCloseButton = leaderboardWindow.querySelector('.window-control.close');

  leaderboardCloseButton.addEventListener('click', () => {
    leaderboardWindow.style.display = 'none';
  });
}

// Initialize window controls functionality
handleWindowControls();

// Tab functionality
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    // Add active class to clicked tab
    tab.classList.add('active');
    // Open the URL in a new window or tab
    window.open(tab.getAttribute('data-url'), '_blank');
  });
});

// IE Toolbar Button Functionality
document.querySelector('.back-button').addEventListener('click', () => {
  alert('Back button clicked!');
});

document.querySelector('.forward-button').addEventListener('click', () => {
  alert('Forward button clicked!');
});

document.querySelector('.refresh-button').addEventListener('click', () => {
  location.reload();
});

document.querySelector('.home-button').addEventListener('click', () => {
  window.location.href = 'https://www.yoursite.com'; // Replace with your home URL
});
