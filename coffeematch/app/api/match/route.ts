import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/lib/semantic';

export async function GET(req: any){
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    
    console.log("🔍 API received userId:", userId);
    console.log("🔍 userId type:", typeof userId);
    
    if (!userId) {
      return NextResponse.json({ error: "No userId provided" }, { status: 400 });
    }
    
    const res = await semanticSearch(userId);
    // ... rest
  } catch (error: any) {
    console.log("🚨 API Error details:", error);
    console.log("🚨 Error name:", error.name);
    console.log("🚨 Error message:", error.message);
    return NextResponse.json({ 
      message: "Unsuccessful matching: ", 
      error: error.message || error.toString() 
    });
  }
}