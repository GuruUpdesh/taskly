import type { NextApiRequest, NextApiResponse } from 'next'
import openai from '~/actions/openai'

 
type ResponseData = {
    message: string
}
 
export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const response = await openai.createCompletion({
        model: 'gpt-3',
        prompt: "This is a test",
    });
    
    res.status(200).json(response)
}