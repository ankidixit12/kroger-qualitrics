import { useEffect, useState } from 'react';

function App() {
  const [surveyUrl, setSurveyUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const embedUrl = import.meta.env.VITE_QUALTRICS_EMBED_URL;
    if (embedUrl) {
      setSurveyUrl(embedUrl);
      setLoading(false);
      return;
    }

    fetch('/api/qualtrics-link')
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load Qualtrics URL');
        return res.json();
      })
      .then((data) => {
        setSurveyUrl(data.qualtricsUrl);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-shell">
      <header>
        <h1>Kroger Qualtrics Plugin</h1>
        <p>Embedded Qualtrics survey for Staffbase Studio.</p>
      </header>

      {loading && <div className="status">Loading survey...</div>}
      {error && <div className="status error">{error}</div>}

      {!loading && !error && surveyUrl && (
        <iframe
          title="Qualtrics Survey"
          src={surveyUrl}
          className="survey-frame"
          loading="lazy"
        />
      )}

      {!loading && !error && !surveyUrl && (
        <div className="status warning">
          No Qualtrics survey URL configured. Set `VITE_QUALTRICS_EMBED_URL` or configure the server.
        </div>
      )}
    </div>
  );
}

export default App;
