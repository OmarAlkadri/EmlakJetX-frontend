import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: 'dehaahbqu',
  api_key: '826455795328819',
  api_secret: 's6DnxMdEdF2g6tv2ct6SU_Xq1JI',
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64File}`;

    const uploadedImage = await cloudinary.uploader.upload(dataUri, {
      folder: 'nextjs_uploads',
    });

    return NextResponse.json({ url: uploadedImage.secure_url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed', details: error }, { status: 500 });
  }
}
