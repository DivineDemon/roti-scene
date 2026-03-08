import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("image") as File;

		if (!file) {
			return NextResponse.json({ error: "No image provided" }, { status: 400 });
		}

		const buffer = await file.arrayBuffer();
		const base64Image = Buffer.from(buffer).toString("base64");

		const imgbbParams = new URLSearchParams();

		if (!process.env.IMGBB_API_KEY) {
			return NextResponse.json(
				{ error: "IMGBB_API_KEY is not configured" },
				{ status: 500 },
			);
		}
		imgbbParams.append("key", process.env.IMGBB_API_KEY);
		imgbbParams.append("image", base64Image);

		const response = await fetch("https://api.imgbb.com/1/upload", {
			method: "POST",
			body: imgbbParams,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("ImgBB API error:", errorText);
			return NextResponse.json(
				{ error: "Failed to upload image" },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json({ url: data.data.url });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
