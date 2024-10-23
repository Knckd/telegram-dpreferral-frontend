// script.js

// Backend URL (Update this to your actual backend URL)
const backendUrl = 'https://your-backend-domain.com'; // Replace with your backend URL

// Handle Verify Button Click
document.getElementById('verifyButton').addEventListener('click', async function () {
  const telegramUsername = document.getElementById('telegramUsername').value.trim();

  if (!telegramUsername) {
    alert('Please enter your Telegram username.');
    return;
  }

  document.getElementById('loading').style.display = 'block';

  try {
    const response = await fetch(`${backendUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramUsername }),
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('referralLink').value = data.referralLink;
      document.getElementById('referralSection').style.display = 'block';
    } else {
      document.getElementById('verificationMessage').textContent = data.message;
    }
  } catch (error) {
    console.error('Verification Error:', error);
    document.getElementById('verificationMessage').textContent = 'An error occurred during verification.';
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
});

// Handle Copy Button Click
document.getElementById('copyButton').addEventListener('click', function () {
  const referralLink = document.getElementById('referralLink').value;

  navigator.clipboard.writeText(referralLink).then(() => {
    alert('Referral link copied to clipboard!');
    startChaosEffect();
  }).catch(() => {
    alert('Failed to copy referral link.');
  });
});

// Chaos Effect
function startChaosEffect() {
  document.body.classList.add('chaos');
  const chaosInterval = setInterval(createChaosWindow, 500);

  setTimeout(() => {
    clearInterval(chaosInterval);
    document.body.classList.remove('chaos');
  }, 10000); // Chaos lasts for 10 seconds
}

function createChaosWindow() {
  const chaosWindow = document.createElement('div');
  chaosWindow.classList.add('chaos-window');
  chaosWindow.textContent = 'Chaos!';
  chaosWindow.style.top = `${Math.random() * window.innerHeight}px`;
  chaosWindow.style.left = `${Math.random() * window.innerWidth}px`;
  document.body.appendChild(chaosWindow);

  setTimeout(() => {
    document.body.removeChild(chaosWindow);
  }, 5000);
}

// Window Controls (Minimize, Maximize, Close)
document.querySelectorAll('.title-bar-controls .close-button').forEach(button => {
  button.addEventListener('click', function () {
    const windowElement = this.closest('.window');
    windowElement.style.display = 'none';
  });
});

// Taskbar Item Clicks
document.querySelectorAll('.taskbar-item').forEach(item => {
  item.addEventListener('click', function () {
    const windowId = this.getAttribute('data-window');
    const windowElement = document.getElementById(windowId);
    windowElement.style.display = 'block';
  });
});
