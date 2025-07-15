import OpenAI from 'openai';
import 'dotenv/config'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});


//takes in users info and uses openAi embedding to embed info into a vector 
export async function embedProfile({bio, goals, tech_stack} :
   {bio: string, goals: string, tech_stack: string[]})
{
  const input = `${bio}. Goals: ${goals}. Tech Stack: ${tech_stack.join(', ')}`

  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input
  });

  return res.data[0].embedding

}