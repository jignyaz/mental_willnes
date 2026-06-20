const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create a test app without starting the server
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', (req, res) => {
    const { journal, message } = req.body;
    if (!journal && !message) {
        return res.status(400).json({ error: 'Invalid request.' });
    }
    return res.status(200).json({ companionResponse: 'Test response' });
});

describe('POST /api/chat', () => {
    test('returns 400 when no body provided', async () => {
        const res = await request(app).post('/api/chat').send({});
        expect(res.statusCode).toBe(400);
    });

    test('returns 200 when journal is provided', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ journal: 'I am stressed', exam: 'JEE' });
        expect(res.statusCode).toBe(200);
    });

    test('returns 200 when message is provided', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'I need help', exam: 'NEET' });
        expect(res.statusCode).toBe(200);
    });
});