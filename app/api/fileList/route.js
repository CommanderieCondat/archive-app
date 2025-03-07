// import { connectToDatabase } from '@/lib/mongodb';
// import Archive from '@/models/File';

// export async function handler(req, res) {
//   await connectToDatabase();

//   try {
//     // Fetch files with image_data as a Base64 string
//     // const files = await Archive.find({}, 'filename source json_data image_data').lean();
//     const files = await Archive.find({}, 'filename').lean();

//     // Convert image_data from Buffer to Base64
//     const filesWithBase64 = files.map(file => ({
//       ...file,
//       image_data: file.image_data ? file.image_data.toString('base64') : null,  // 👈 Convert to Base64
//     }));

//     res.status(200).json(filesWithBase64);
//   } catch (error) {
//     console.error('❌ Error fetching files:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


import { connectToDatabase } from '@/lib/mongodb';
import Archive from '@/models/Archive';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();

  try {
    // Fetch files with image_data as a Base64 string
    const files = await Archive.find({}, 'filename').lean();

    // Convert image_data from Buffer to Base64 if needed
    const filesWithBase64 = files.map(file => ({
      ...file,
      image_data: file.image_data ? file.image_data.toString('base64') : null,
    }));

    // Return the result using NextResponse
    return NextResponse.json(filesWithBase64);
  } catch (error) {
    console.error('❌ Error fetching files:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
