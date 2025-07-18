import 'dotenv/config';
import { pc } from './pinecone';
import { embedProfile } from './embed';
import { supabase } from './supabase';

type UserRole = "Mentee" | "Mentor";

interface NewUser{
  id: string,
	full_name: string;
	bio: string;
	goals: string;
	tech_stack: string[];
	role: UserRole;
	school: string;
	major: string;
	linkedin: string;
	github: string;
	portfolio: string;
}

export async function upsertUser(userData: NewUser){
  
  let { id: userId, bio, goals, tech_stack, role } = userData
  const vector = await embedProfile({ bio, goals, tech_stack });
  
  //index is the table/sapce within your vector database you want to upsert into 
  const index = pc.Index(process.env.PINECONE_INDEX_NAME!);
  await index.upsert([
    {
      id: userId,  // Use the id from userData, not from auth context
      values: vector,
      metadata: { userId, role, onboarding_status: 2, user_tech: tech_stack },
    },
  ]);
  

  console.log('Upserted user into Pinecone!');
}

