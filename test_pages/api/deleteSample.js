import { connectToDatabase } from "@/lib/mongodb";
import Sample from '@/models/Sample';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { filename, id_line } = req.body;

    if (!filename || !id_line ) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const { db } = await connectToDatabase();
        // Delete document from "samples" collection
        const result = await Sample.deleteOne({ filename, id_line });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.status(200).json({ message: "Line deleted successfully" });
        
    } catch (error) {
        console.error("Error updating text:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
