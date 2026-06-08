import React, { useEffect, useState } from 'react';
import * as StaffbaseSDK from '@staffbase/plugins-client-sdk';
import { loadQualtrics } from './QualtricsLoader.js';
import { refreshQualtrics } from './RouteListener.js';

function App({ context }) {
  const [status, setStatus] = useState('Starting plugin...');
  const user = context?.user || {};
  const userId = user.id || user.externalId || 'anonymous';
  const [envInfo, setEnvInfo] = useState({
    isMobileApp: false,
    instanceUrl: '',
    hasStaffbaseGlobal: false,
  });

  useEffect(() => {
    try {
      setEnvInfo({
        isMobileApp: StaffbaseSDK.isMobileApp(),
        instanceUrl: StaffbaseSDK.getInstanceUrl ? StaffbaseSDK.getInstanceUrl() : '',
        hasStaffbaseGlobal: Boolean(window.Staffbase),
      });
    } catch (error) {
      setEnvInfo((prev) => ({ ...prev, hasStaffbaseGlobal: false }));
    }

    loadQualtrics(userId);
    setStatus(`Loaded Qualtrics for user ${userId}`);

    if (context.router && typeof context.router.listen === 'function') {
      context.router.listen(() => {
        refreshQualtrics();
        setStatus('Route changed: refreshed Qualtrics intercept');
      });
    }
  }, [context, userId]);

  return (
    <div style={styles.shell}>
      <div style={styles.card}>
        <h1 style={styles.title}>Kroger Qualtrics Staffbase Plugin</h1>
        <p style={styles.text}>
          This plugin uses the Staffbase client SDK and React to load the Qualtrics
          intercept script inside Staffbase.
        </p>
        <div style={styles.section}>
          <strong>Status:</strong> {status}
        </div>
        <div style={styles.section}>
          <strong>User:</strong> {userId}
        </div>
        <div style={styles.section}>
          <strong>Environment:</strong>
          <ul style={styles.list}>
            <li>Staffbase global detected: {envInfo.hasStaffbaseGlobal ? 'Yes' : 'No'}</li>
            <li>Mobile app: {envInfo.isMobileApp ? 'Yes' : 'No'}</li>
            <li>Instance URL: {envInfo.instanceUrl || 'unknown'}</li>
          </ul>
        </div>
        <div style={styles.section}>
          <p style={styles.text}>
            To test intercepts, add one of the following query params to the Staffbase
            page URL and refresh:
          </p>
          <ul style={styles.list}>
            <li><code>?QualtricsTest_PopUp</code></li>
            <li><code>?QualtricsTest_FeedbackButton</code></li>
            <li><code>?QualtricsTest_Embedded</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
    padding: '20px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '760px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '1.8rem',
  },
  text: {
    margin: '0 0 12px',
    lineHeight: 1.6,
  },
  section: {
    marginTop: '18px',
  },
  list: {
    margin: '8px 0 0',
    paddingLeft: '18px',
  },
};

export default App;
