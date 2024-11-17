import { NextResponse } from 'next/server';
import Jimp from 'jimp';
import { binaryToText } from '../../../lib/utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Missing image' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const image = await Jimp.read(buffer);
    let binaryMessage = '';
    let endMarkerFound = false;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      if (!endMarkerFound) {
        binaryMessage += (this.bitmap.data[idx] & 1).toString();
        binaryMessage += (this.bitmap.data[idx + 1] & 1).toString();
        binaryMessage += (this.bitmap.data[idx + 2] & 1).toString();

        if (binaryMessage.includes('11111111')) {
          endMarkerFound = true;
          binaryMessage = binaryMessage.split('11111111')[0];
        }
      }
    });

    const decryptedMessage = binaryToText(binaryMessage);

    return NextResponse.json({ message: decryptedMessage });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: 'Decryption failed' },
      { status: 500 }
    );
  }
}