import express from 'express';
import path from 'path';
import { saveClickCsv, saveClickTxt } from './utils';

const app = express();

app.get('/', (req, res) => {
  try {
    if (req.query.email) {
      saveClickTxt(req.query.email as string);
      saveClickCsv(req.query.email as string);
    }
    res
      .status(200)
      .sendFile(path.join(__dirname, 'templates', 'success.html'));
  } catch (error) {
    res
      .status(400)
      .sendFile(path.join(__dirname, 'templates', 'error.html'));
  }
});

app.listen(3333, () => {
  console.log('server running...');
});