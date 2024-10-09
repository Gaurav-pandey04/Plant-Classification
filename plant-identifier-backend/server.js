import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to remove formatting
function removeFormatting(text) {
  return text.replace(/\*\*/g, '').replace(/\*/g, '');
}

app.post('/api/analyze-plant', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);
    const imageBase64 = imageData.toString('base64');

    // First prompt: Check if it's a plant
    const isPlantResult = await model.generateContent([
      "Is this image of a plant? Reply with only true or false.",
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
    ]);
    const isPlantResponse = isPlantResult.response.text().trim().toLowerCase();
    console.log('Is Plant Response:', isPlantResponse);
    const isPlant = isPlantResponse === 'true';

    if (isPlant == true) {
      console.log('It is a plant');
      return res.json({ isPlant: true });
    }

    // Second prompt: Get plant name
    const nameResult = await model.generateContent([
      "What is the name of this plant? Provide only the name without any additional text.",
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
    ]);
    const plantName = removeFormatting(nameResult.response.text().trim());
    console.log('Plant Name Response:', plantName);

    // Third prompt: Get plant information
    const infoResult = await model.generateContent([
      `Provide a brief description of the ${plantName}, including where it is found, its uses, and any interesting facts. Give the response in a single paragraph without any formatting or bold text.`,
    ]);
    const plantInfo = removeFormatting(infoResult.response.text().trim());
    console.log('Plant Info Response:', plantInfo);

    res.json({ 
      isPlant: true, 
      plantName, 
      plantInfo,
      imageData: `data:${req.file.mimetype};base64,${imageBase64}` 
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image', details: error.message });
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
