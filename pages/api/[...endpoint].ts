// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

// TODO HOW CACHE THE RESPONSES?
export const revalidate = 3600 * 24 * 7 * 52;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(await getImaginedResponse(req));
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
}

export const getImaginedResponse = async (req: NextApiRequest) => {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPEN_AI_SECRET,
    })
  );

  const prompt = `Imagine the JSON response of a GET call to a endpoint ${rebuildEndpoint(req.query)}. Give nothing but the imagined JSON please, that is, provide no explanation before or after the code.`;

  // Look for a cached response
  const prisma = new PrismaClient();
  const endpoint = await prisma.endpoint.findFirst({
    where: {
      url: rebuildEndpoint(req.query),
    },
  });

  if (endpoint) return endpoint.response;

  const moderation = await openai.createModeration({
    input: JSON.stringify(req.query),
  });

  const [result] = moderation.data.results;
  if (result.flagged) throw Error("The prompt may violate OpenAI terms of service");
  console.log(prompt, moderation.data.results);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Imagine the JSON response of a GET call to a endpoint ${rebuildEndpoint(req.query)}. Give nothing but the imagined JSON please, that is, provide no explanation before or after the code.`,
    temperature: 0,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  console.log("Received response from OpenAI");

  const responseContent = completion.data.choices[0].text as string;

  const responseObject = JSON.parse(responseContent);
  if (!responseObject) throw new Error("Could not parse JSON");

  await prisma.endpoint.create({
    data: {
      url: rebuildEndpoint(req.query),
      method: "GET",
      response: responseObject,
    },
  });

  return responseObject;
};

export const rebuildEndpoint = (query: any): string => {
  let endpoint = query.endpoint.join("/");

  const keys = Object.keys(query).filter((key) => key !== "endpoint");

  if (keys.length > 0) {
    endpoint += "?";
  }

  keys.forEach((key, index) => {
    endpoint += `${key}=${query[key]}`;
    if (index < keys.length - 1) {
      endpoint += "&";
    }
  });

  return encodeURI(endpoint);
};
