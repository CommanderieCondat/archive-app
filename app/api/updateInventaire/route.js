import { connectToDatabase } from "@/lib/mongodb";
import Archive from '@/models/Archive';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { filename, id_line, newText } = await req.json();
        if (!filename || !id_line || !newText) {
            return NextResponse.json({ error: "Missing required fields in the request body" }, { status: 400 });
        }
        await connectToDatabase();
        // Find the document by filename
        const file = await Archive.findOne({ filename });

        if (!file) {
            console.error("File not found:", filename);
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }        // Extract json_data and update the text for the specified id_line
        
        const updatedJsonData = { ...file.json_data };
        updatedJsonData.lines = updatedJsonData.lines.map(line =>
            line.id_line === id_line ? { ...line, text: newText } : line
        );

        // Update the document with the modified json_data
        const result = await Archive.updateOne(
            { filename },
            { $set: { "json_data": updatedJsonData } }
        );

        if (result.modifiedCount === 0) {
            console.error("No changes made or document not found:", filename);
            return NextResponse.json({ error: "No changes made or document not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Text updated successfully in inventaireMalte" }, { status: 200 });
    } catch (error) {
        console.error("Error updating text in inventaireMalte:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}