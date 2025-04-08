import { NextRequest, NextResponse } from 'next/server';
import {supabase} from '@/util/supabase';

interface ScannerData {
  id: string, // 9 digit student id string
  time: number, // milliseconds since epoch
}

export async function POST(req: NextRequest) {
  try {
    const scanData: ScannerData = await req.json();
    console.log('Received data:', scanData);
    
    if (scanData.id.length != 9) {
      throw TypeError("Received id is not 9 digits.");
    }
    if (Number.isNaN(Number(scanData.id))) {
      throw TypeError("Received id is not numeric.");
    }

    console.log("id: %d", scanData.id);
    const date = new Date(scanData.time);
    console.log("date: ", date.toString());

    const {data, error} = await supabase.from('History')
        .insert({
        "id": scanData.id,
        "class": "test",
        "status": "On Time"
    })

    if(error){
      console.log(error);
      return NextResponse.json({ error: 'Supabase Error' }, { status: 500 });
    }

    // Do something with the data (e.g., store in DB, send a notification, etc.)

    return NextResponse.json({ message: 'Data received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
