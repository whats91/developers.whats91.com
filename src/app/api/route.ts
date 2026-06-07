import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Not Found",
      message: "This route is not a documentation endpoint.",
    },
    {
      status: 404,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
