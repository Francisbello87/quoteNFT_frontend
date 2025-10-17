import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; 

export async function POST(req: NextRequest) {
  try {
    const { quote } = await req.json();

    if (!quote) {
      return NextResponse.json({ error: "Missing quote" }, { status: 400 });
    }

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            fontSize: 36,
            color: "white",
            background: "linear-gradient(135deg, #1e3a8a, #9333ea)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          {quote}
        </div>
      ),
      {
        width: 1000,
        height: 500,
      }
    );


    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    const pinataJWT = process.env.PINATA_JWT;
    if (!pinataJWT) {
      return NextResponse.json(
        { error: "Missing PINATA_JWT" },
        { status: 500 }
      );
    }

    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/png" });
    formData.append("file", blob, "quote.png");

    const pinataRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
        },
        body: formData,
      }
    );

    if (!pinataRes.ok) {
      const errorText = await pinataRes.text();
      console.error("Pinata upload error:", errorText);
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 500 }
      );
    }

    const json = await pinataRes.json();
    const imageUri = `ipfs://${json.IpfsHash}`;

    console.log("✅ Image uploaded to:", imageUri);

    return NextResponse.json({ imageUri });
  } catch (error) {
    console.error("Generate image error:", error);
    return NextResponse.json(
      { error: "Failed to generate/upload image" },
      { status: 500 }
    );
  }
}
