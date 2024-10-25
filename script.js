// script.js

// Ensure that the control buttons function correctly
const minimizeButton = document.querySelector('.control-button.minimize');
const maximizeButton = document.querySelector('.control-button.maximize');
const closeButton = document.querySelector('.control-button.close');
const browserWindow = document.querySelector('.browser-window');

let isMaximized = false;

// Minimize Button
minimizeButton.addEventListener('click', () => {
  browserWindow.style.display = 'none';
  createMinimizedBar();
});

// Maximize Button
maximizeButton.addEventListener('click', () => {
  if (!isMaximized) {
    browserWindow.style.width = '100%';
    browserWindow.style.height = '100%';
    browserWindow.style.top = '0';
    browserWindow.style.left = '0';
    browserWindow.style.margin = '0';
    browserWindow.style.borderRadius = '0';
    isMaximized = true;
  } else {
    browserWindow.style.width = '800px';
    browserWindow.style.height = 'auto';
    browserWindow.style.margin = '50px auto';
    browserWindow.style.borderRadius = '0';
    isMaximized = false;
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
    minimizedBar.textContent = 'Telegram DP Referral Portal';
    minimizedBar.addEventListener('click', () => {
      browserWindow.style.display = 'block';
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

// Rest of your existing script...
