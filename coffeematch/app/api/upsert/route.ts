import { NextRequest, NextResponse } from 'next/server';
import { upsertUser } from '@/lib/upsertUser';

export async function POST(req: NextRequest){
  try{
     
      const formData = await req.json();
      
      // Make sure we have a user ID
      if (!formData.id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }

       await upsertUser(formData);

      return NextResponse.json({ message: "Upserted new user successfully!"});
  } catch(error: any){
    console.error("Unsuccessful upsertion", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
   }
} 