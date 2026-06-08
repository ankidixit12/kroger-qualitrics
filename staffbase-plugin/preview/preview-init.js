const logArea = document.getElementById('logs');
const log = (message) => {
  logArea.textContent += message + '\n';
};

const initPreview = async () => {
  try {
    const { default: initPlugin } = await import('/dist/index.js');
    const context = {
      user: { id: 'dev-user-001', externalId: 'dev-user-001' },
      router: {
        listen(callback) {
          document.getElementById('refresh').addEventListener('click', () => {
            log('SPA route refresh triggered');
            callback();
          });
        }
      }
    };

    initPlugin(context);
    log('Plugin initialized with fake Staffbase context.');
  } catch (error) {
    log('Plugin load failed: ' + error.message);
    console.error(error);
  }
};

initPreview();

document.getElementById('testPopup').addEventListener('click', () => {
  const url = new URL(window.location.href);
  url.searchParams.set('QualtricsTest_PopUp', '1');
  window.location.href = url.toString();
});

document.getElementById('testFeedback').addEventListener('click', () => {
  const url = new URL(window.location.href);
  url.searchParams.set('QualtricsTest_FeedbackButton', '1');
  window.location.href = url.toString();
});

document.getElementById('testEmbedded').addEventListener('click', () => {
  const url = new URL(window.location.href);
  url.searchParams.set('QualtricsTest_Embedded', '1');
  url.searchParams.set('qualtricsSelector', '#embedded-target');
  window.location.href = url.toString();
});

const demoTarget = document.createElement('div');
demoTarget.id = 'embedded-target';
demoTarget.style.marginTop = '18px';
demoTarget.innerHTML = '<strong>Embedded intercept demo target</strong> <div id="embedded-target-inner"></div>';
document.querySelector('.card').appendChild(demoTarget);
