import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const match = envFile.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
    console.log("No API Key");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
async function list() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
list();
