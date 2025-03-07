import { connectToDatabase } from "@/lib/mongodb";
import Sample from '@/models/Sample';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { filename, id_line, newText } = req.body;

    if (!filename || !id_line || !newText) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await Sample.updateOne(
            { filename, id_line },
            { $set: { text: newText } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Document not found or text unchanged" });
        }

        res.status(200).json({ message: "Text updated successfully" });
    } catch (error) {
        console.error("Error updating text:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
