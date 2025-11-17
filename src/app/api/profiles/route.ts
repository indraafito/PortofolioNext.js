import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    let { rows } = await query("SELECT * FROM profiles ORDER BY created_at ASC");
    
    if (rows.length === 0) {
      const insert = await query(
        `INSERT INTO profiles (full_name, tagline, title, photo_url)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          "Afito Indra Permana",
          "Passionate about creating innovative solutions through code",
          "Informatics Engineer",
          null,
        ]
      );
      rows = insert.rows;
    }
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Get profiles error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}