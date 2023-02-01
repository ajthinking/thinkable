// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

// TODO HOW CACHE THE RESPONSES?
export const revalidate = 3600 * 24 * 7 * 52;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(await getImaginedResponse(req));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getImaginedResponse = async (req: NextApiRequest) => {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPEN_AI_SECRET,
    })
  );

  // TODO SEND A REQUEST TO SPAM/ABUSE PROTECTION ENDPOINT FIRST

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Imagine the JSON response of a GET call to a endpoint ${rebuildEndpoint(
      req.query
    )}. Give nothing but the imagined JSON please, that is, provide no explanation before or after the code. If the response is an array of items, please provide ~5 items.`,
    temperature: 0,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  const responseContent = completion.data.choices[0].text as string;

  const responseJson = JSON.parse(responseContent);
  if (!responseJson) throw new Error("Could not parse JSON");

  return responseJson;
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
