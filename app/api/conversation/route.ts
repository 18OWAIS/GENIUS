import { auth } from "@clerk/nextjs";
import { NextResponse,NextRequest } from "next/server";
import OpenAI from 'openai';

import { checkSubscription } from "@/../lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/../lib/api-limit";

const config = new OpenAI({
  apiKey:process.env.OPEN_API_KEY!, // This is the default and can be omitted
  dangerouslyAllowBrowser: true,
});


// console.log("yese")

export async function POST(
  req: NextRequest
) {
  try {
  
    const { userId } = auth();
    const body = await req.json();
    const  {messages}  = body;

    // Ask OpenAI for a streaming chat completion given the prompt
  
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    console.log(config.apiKey)
    if (!config.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    console.log(freeTrial);

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const response = await config.chat.completions.create({
     messages,
      model: "gpt-3.5-turbo",});
      console.log(response)

      
      if (!isPro) {
        await incrementApiLimit();
        }
        
        return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("not found", { status: 404 });
  }
};
