import { NextRequest, NextResponse } from 'next/server';

interface ScannerData {
  id: number, // 9 digit student id
  time: number, // milliseconds since epoch
}

export async function POST(req: NextRequest) {
  try {
    const data: ScannerData = await req.json();
    console.log('Received data:', data);

    console.log("id: %d", data.id);
    const date = new Date(data.time);
    console.log("date: ", date.toString());

    // Do something with the data (e.g., store in DB, send a notification, etc.)

    return NextResponse.json({ message: 'Data received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
