import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const letters = [
  "الألف", "واو مدية", "ياء مدية", "همزة", "هاء", "عين", "حاء", "غين", "خاء", 
  "قاف", "كاف", "جيم", "شين", "ضاد", "لام", "نون", "راء", "طاء", "دال", 
  "تاء", "صاد", "زاي", "سين", "ظاء", "ذال", "ثاء", "فاء", "باء", "ميم"
];

const dir = path.join(process.cwd(), 'public', 'audio');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function generate() {
  console.log('Starting audio generation...');
  for (const letter of letters) {
    try {
      const base64 = await googleTTS.getAudioBase64(letter, {
        lang: 'ar',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      
      const buffer = Buffer.from(base64, 'base64');
      fs.writeFileSync(path.join(dir, `${letter}.mp3`), buffer);
      console.log(`✅ Saved ${letter}.mp3`);
      
      // Sleep to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`❌ Failed to generate audio for ${letter}:`, e.message);
    }
  }
  console.log('Done!');
}

generate();
