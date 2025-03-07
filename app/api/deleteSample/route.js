import { connectToDatabase } from "@/lib/mongodb";
import Sample from '@/models/Sample';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { filename, id_line } = await request.json();
    if (!filename || !id_line ) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    try {
        const { db } = await connectToDatabase();
        // Delete document from "samples" collection
        const result = await Sample.deleteOne({ filename, id_line });
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Document not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Line deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating text:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

