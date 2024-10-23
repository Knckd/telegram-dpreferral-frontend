// Replace with your backend URL
const backendUrl = 'https://telegram-dpreferral-backend.onrender.com'; // Update this to your actual backend URL

const claimButton = document.getElementById('claimButton');
const claimMessage = document.getElementById('claimMessage');
const chaosSound = document.getElementById('chaosSound');

// Handle Claim Button Click
claimButton.addEventListener('click', async () => {
  // Disable the button to prevent multiple clicks
  claimButton.disabled = true;
  claimButton.textContent = 'Claiming...';

  try {
    const response = await fetch(`${backendUrl}/api/claim`, { // Ensure you have this endpoint in your backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* Include necessary data here, e.g., user info */ }),
    });

    const data = await response.json();

    if (data.success) {
      claimMessage.textContent = '350 Free Tokens Claimed Successfully!';
      claimMessage.style.color = 'green';
      // Start chaotic effects
      startChaos();
      // Optionally, notify the backend about the claim
      notifyBackendOfClaim();
    } else {
      claimMessage.textContent = data.message || 'Failed to claim tokens. Please try again.';
      claimMessage.style.color = 'red';
    }
  } catch (error) {
    console.error('Error:', error);
    claimMessage.textContent = 'An error occurred. Please try again.';
    claimMessage.style.color = 'red';
  } finally {
    // Re-enable the button
    claimButton.disabled = false;
    claimButton.textContent = 'Claim';
  }
});

// Notify backend about the claim (if needed)
async function notifyBackendOfClaim() {
  try {
    await fetch(`${backendUrl}/api/claimNotification`, { // Ensure you have this endpoint in your backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* Include necessary data here, e.g., user info */ }),
    });
    console.log('Claim notification sent to backend.');
  } catch (error) {
    console.error('Error notifying backend:', error);
  }
}

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' class from all buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Add 'active' class to the clicked button
    button.classList.add('active');

    // You can add functionality to display different content based on the active tab
    // For example, navigate to different sections or load different content dynamically
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
