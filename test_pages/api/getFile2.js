import { connectToDatabase } from "@/lib/mongodb";
import Sample from '@/models/Sample';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed, use POST" });
    return;
  }

  const { filename, id_line } = req.body;  // Get filename from request body

  if (!filename) {
    res.status(400).json({ error: "Filename is required in the request body" });
    return;
  }

  try {
    const { db } = await connectToDatabase();

    // if (!db) {
    //   console.error("Database connection failed!");
    //   res.status(500).json({ error: "Database connection failed" });
    //   return;
    // }

    // console.log("Connected to database. Fetching file:", filename, id_line);
    // const file = await db
    const file = await Sample.findOne({ filename, id_line });

    if (!file) {
      console.error("File not found:", filename, id_line);
      res.status(404).json({ error: "File not found" });
      return;
    }

    // console.log("File found:", file.filename, file.id_line);

    // Convert image_data Buffer to Base64 if it exists
    const base64Image = file.image_data
      ? file.image_data.toString("base64")
      : null;

    // Send the response with the Base64-encoded image
    res.status(200).json({
      _id: file._id,
      filename: file.filename,
      id_line: file.id_line,
      image_data: base64Image,  // Base64 encoded string
      text: file.text
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// curl -X POST http://localhost:3000/api/getFile2 -H "Content-Type: application/json" -d '{"filename": "FRAD031_H_MALTEINV_000058_0009.png","id_line": 0 }'