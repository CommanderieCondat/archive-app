import { connectToDatabase } from '@/lib/mongodb';
import Archive from '@/models/Archive';

export default async function handler(req, res) {
  await connectToDatabase();

  try {
    // Fetch files with image_data as a Base64 string
    // const files = await Archive.find({}, 'filename source json_data image_data').lean();
    const files = await Archive.find({}, 'filename').lean();

    // Convert image_data from Buffer to Base64
    const filesWithBase64 = files.map(file => ({
      ...file,
      image_data: file.image_data ? file.image_data.toString('base64') : null,  // 👈 Convert to Base64
    }));

    res.status(200).json(filesWithBase64);
  } catch (error) {
    console.error('❌ Error fetching files:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
