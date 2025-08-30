import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pb = new PocketBase('http://back.buyur.yurtal.tech');

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = {
            name: body.name,
            volume: body.volume,
            user: body.user,
            type: body.type,
            location: body.location,
            from: body.from,
            to: body.to,
            model: body.model,
            carNumber: body.carNumber,
        };

        const record = await pb.collection("cars").create(data);

        return NextResponse.json(record, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: String(error) }, { status: 400 });
    }

}

export async function GET() {
    const records = await pb.collection('cars').getFullList({
        sort: '-created',
    });
    return new Response(JSON.stringify(records), { status: 200 });
}