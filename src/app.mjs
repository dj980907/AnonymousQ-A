import './config.mjs';
import mongoose from 'mongoose';
import express from 'express';
import Question from './db.mjs';
import url from 'url';
import path from 'path';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Your existing routes...

app.post('/questions/', async (req, res) => {
  try {
    const newQuestion = await Question.create({ question: req.body.question, answers: [] });
    res.json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add question' });
  }
});

app.post('/questions/:id/answers/', async (req, res) => {
  const questionId = req.params.id;
  const answerText = req.body.answer;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $push: { answers: answerText } },
      { new: true }
    );

    if (!updatedQuestion) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    res.json({ success: 'Added an answer', updatedQuestion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

app.get('/questions/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
