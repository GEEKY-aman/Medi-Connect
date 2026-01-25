
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { predictDisease, findNearbyHospitals } from './services/gemini';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/predict-disease', async (req: Request, res: Response) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms || !Array.isArray(symptoms)) {
            res.status(400).json({ error: 'Symptoms array is required' });
            return;
        }
        const result = await predictDisease(symptoms);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to predict disease' });
    }
});

app.post('/api/hospitals', async (req: Request, res: Response) => {
    try {
        const { query, location } = req.body;
        const result = await findNearbyHospitals(query, location);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch hospitals' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
