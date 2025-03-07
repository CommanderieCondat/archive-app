import { connectToDatabase } from "@/lib/mongodb";
import Archive from '@/models/Archive';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { filename, id_line } = req.body;

    if (!filename || !id_line) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const { db } = await connectToDatabase();

        // Find the document by filename
        const file = await Archive.findOne({ filename });

        if (!file) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Filter out the line to delete
        // const updatedLines = document.json_data.lines.filter(line => line.id_line !== id_line);

        // Remove the json_data entry with the specified id_line
        const updatedJsonData = { ...file.json_data };
        updatedJsonData.lines = updatedJsonData.lines.filter(line =>
            line.id_line !== id_line
        );

        // console.log(updatedJsonData)

        // Update the document with the modified json_data
        const result = await Archive.updateOne(
            { filename },
            { $set: { "json_data": updatedJsonData } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No changes made or document not found" });
        }

        res.status(200).json({ message: "Text updated successfully in inventaireMalte" });
    } catch (error) {
        console.error("Error updating text in inventaireMalte:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
