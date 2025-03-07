import { connectToDatabase } from "@/lib/mongodb";
import Sample from '@/models/Sample';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { filename, id_line } = await req.json();

    if (!filename) {
      return NextRespone.json({ error: "Filename is required in the request body" }, { status: 400});
    }

    await connectToDatabase();
    const file = await Sample.findOne({ filename, id_line });
    
    if (!file) {
        console.error("File not found:", filename, id_line);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Convert image_data Buffer to Base64 if it exists
    const base64Image = file.image_data
    ? file.image_data.toString("base64")
    : null;

    // Send the response with the Base64-encoded image
    return NextResponse.json({
        _id: file._id,
        filename: file.filename,
        id_line: file.id_line,
        image_data: base64Image,  // Base64 encoded string
        text: file.text
        });
    } catch (error) {
      console.error("Error fetching file:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}