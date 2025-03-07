// import { connectToDatabase } from "@/lib/mongodb";
// import Archive from '@/models/File';


// // Increase body size limit to 10MB (or adjust as needed)
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "6mb",  // 👈 Increase this if necessary
//     },
//   },
// };


// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.status(405).json({ error: "Method not allowed, use POST" });
//     return;
//   }

//   const { filename } = req.body;  // Get filename from request body

//   if (!filename) {
//     res.status(400).json({ error: "Filename is required in the request body" });
//     return;
//   }

//   try {
//     const { db } = await connectToDatabase();

//     // if (!db) {
//     //   console.error("Database connection failed!");
//     //   res.status(500).json({ error: "Database connection failed" });
//     //   return;
//     // }

//     // console.log("Connected to database. Fetching file:", filename);
//     // const file = await db
//     const file = await Archive.findOne({ filename });

//     if (!file) {
//       console.error("File not found:", filename);
//       res.status(404).json({ error: "File not found" });
//       return;
//     }

//     // console.log("File found:", file.filename);

//     // Convert image_data Buffer to Base64 if it exists
//     const base64Image = file.image_data
//       ? file.image_data.toString("base64")
//       : null;

//     // Send the response with the Base64-encoded image
//     res.status(200).json({
//       _id: file._id,
//       filename: file.filename,
//       source: file.source,
//       json_data: file.json_data,
//       image_data: base64Image,  // Base64 encoded string
//     });
//   } catch (error) {
//     console.error("Error fetching file:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import Archive from '@/models/Archive';
import { NextResponse } from 'next/server';

// Increase body size limit to 6MB (or adjust as needed)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb",  // 👈 Increase this if necessary
    },
  },
};

// POST request handler
export async function POST(req) {
  try {
    const { filename } = await req.json();  // Get filename from request body

    if (!filename) {
      return NextResponse.json({ error: "Filename is required in the request body" }, { status: 400 });
    }

    await connectToDatabase();
    const file = await Archive.findOne({ filename });

    if (!file) {
      console.error("File not found:", filename);
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
      source: file.source,
      json_data: file.json_data,
      image_data: base64Image,  // Base64 encoded string
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
