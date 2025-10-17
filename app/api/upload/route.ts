import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const pinataJWT = process.env.PINATA_JWT;
    if (!pinataJWT) {
      return NextResponse.json(
        { error: "Missing PINATA_JWT environment variable" },
        { status: 500 }
      );
    }


    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: data.name || "AI Quote NFT",
        },
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Pinata error:", json);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }


    const ipfsUri = `ipfs://${json.IpfsHash}`;
    console.log("Uploaded metadata to:", ipfsUri);

    return NextResponse.json({ ipfsUri });
  } catch (error) {
    console.error("Metadata upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload metadata" },
      { status: 500 }
    );
  }
}
