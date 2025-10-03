import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();

  const response = NextResponse.json({ message: "Token set in cookie" });

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });

  return response;
}