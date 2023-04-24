import type { NextApiRequest, NextApiResponse } from 'next';
import { postToWebhook } from '../../lib/apiClient';

export default async function postNotify(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    try {
      await postToWebhook(req.body);
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ message: 'Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
