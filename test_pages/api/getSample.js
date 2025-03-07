import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { filename, id_line } = await req.json();
        const { db } = await connectToDatabase();

        // Fetch the document from the "samples" collection based on filename and id_line
        const sample = await db.collection("samples").findOne({ filename, id_line });
        // console.log(sample)
        if (!sample) {
            return NextResponse.json({ error: "Sample not found" }, { status: 404 });
        }

        // Convert binary data to base64
        const base64Image = Buffer.from(sample.image_data).toString("base64");

        return NextResponse.json({
            text: sample.text,
            image: base64Image
        });
    } catch (error) {
        console.error("Error fetching sample:", error);
        return NextResponse.json({ error: "Failed to fetch sample" }, { status: 500 });
    }
}


// curl -X POST -H "Content-Type: application/json" -d '{"filename": "FRAD031_H_MALTEINV_000058_0009-1.png",id_line:"0"}' http://localhost:3000/api/getSample
