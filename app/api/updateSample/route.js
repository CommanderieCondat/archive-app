import { connectToDatabase } from "@/lib/mongodb";
import Sample from '@/models/Sample';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { filename, id_line, newText } = await req.json();
        if (!filename || !id_line || !newText) {
            return NextResponse.json({ error: "Missing required fields in the request body" }, { status: 400 });
        }
        const { db } = await connectToDatabase();
        const result = await Sample.updateOne(
            { filename, id_line },
            { $set: { text: newText } }
        );
        if (result.modifiedCount === 0) {
            console.error("No document updated:", filename, id_line);
            return NextResponse.json({ error: "No document updated" }, { status: 404 });
        }
        return NextResponse.json({ message: "Text updated successfully", result }, { status: 200 });
    } catch (error) {
        console.error("Error updating sample:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
 