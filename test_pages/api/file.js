import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { db } = await connectToDatabase();
  console.log
  const { filename } = params;
  console.log(filename)
  const file = await db
    .collection("inventaireMalte")
    .findOne({ filename });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json(file);
}
