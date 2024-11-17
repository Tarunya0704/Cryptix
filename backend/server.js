
const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Utility functions for LSB steganography
const textToBinary = (text) => {
  return text.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
};

const binaryToText = (binary) => {
  const bytes = binary.match(/.{1,8}/g);
  return bytes.map(byte => 
    String.fromCharCode(parseInt(byte, 2))
  ).join('');
};

app.post('/encrypt', upload.single('image'), async (req, res) => {
  try {
    const { buffer } = req.file;
    const message = req.body.message;
    const binaryMessage = textToBinary(message) + '11111111'; // End marker

    const image = await Jimp.read(buffer);
    let binaryIndex = 0;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      if (binaryIndex < binaryMessage.length) {
        // Modify only the least significant bit of each color channel
        this.bitmap.data[idx] = (this.bitmap.data[idx] & 254) | parseInt(binaryMessage[binaryIndex++] || '0');
        if (binaryIndex < binaryMessage.length) {
          this.bitmap.data[idx + 1] = (this.bitmap.data[idx + 1] & 254) | parseInt(binaryMessage[binaryIndex++] || '0');
        }
        if (binaryIndex < binaryMessage.length) {
          this.bitmap.data[idx + 2] = (this.bitmap.data[idx + 2] & 254) | parseInt(binaryMessage[binaryIndex++] || '0');
        }
      }
    });

    const modifiedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    res.set('Content-Type', 'image/png');
    res.send(modifiedBuffer);
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

app.post('/decrypt', upload.single('image'), async (req, res) => {
  try {
    const { buffer } = req.file;
    const image = await Jimp.read(buffer);
    let binaryMessage = '';
    let endMarkerFound = false;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      if (!endMarkerFound) {
        // Extract the least significant bit from each color channel
        binaryMessage += (this.bitmap.data[idx] & 1).toString();
        binaryMessage += (this.bitmap.data[idx + 1] & 1).toString();
        binaryMessage += (this.bitmap.data[idx + 2] & 1).toString();

        // Check for end marker
        if (binaryMessage.includes('11111111')) {
          endMarkerFound = true;
          binaryMessage = binaryMessage.split('11111111')[0];
        }
      }
    });

    const decryptedMessage = binaryToText(binaryMessage);
    res.json({ message: decryptedMessage });
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Decryption failed' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});