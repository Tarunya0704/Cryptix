// app/api/encrypt/route.ts
import { NextResponse } from 'next/server';
import Jimp from 'jimp';
import { textToBinary } from '../../../lib/utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const message = formData.get('message') as string;

    if (!imageFile || !message) {
      return NextResponse.json(
        { error: 'Missing image or message' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const binaryMessage = textToBinary(message) + '11111111'; // End marker

    const image = await Jimp.read(buffer);
    let binaryIndex = 0;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      if (binaryIndex < binaryMessage.length) {
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

    return new NextResponse(modifiedBuffer, {
      headers: { 'Content-Type': 'image/png' }
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Encryption failed' },
      { status: 500 }
    );
  }
}