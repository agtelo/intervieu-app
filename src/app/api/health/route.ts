import { sql } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT 1 as test`;

    return NextResponse.json({
      status: "ok",
      database: result[0]?.test === 1 ? "connected" : "failed",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        database: "failed",
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
