import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;
const qualtricsUrl = process.env.QUALTRICS_SURVEY_URL || process.env.VITE_QUALTRICS_EMBED_URL;

app.use(cors());
app.use(express.json());

app.get('/api/qualtrics-link', (req, res) => {
  if (!qualtricsUrl) {
    return res.status(400).json({ error: 'Qualtrics URL is not configured.' });
  }

  res.json({ qualtricsUrl });
});

const staticDir = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(staticDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
