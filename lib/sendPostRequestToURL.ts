// lib/sendPostRequestToURL.ts
import axios from 'axios';

export async function sendPostRequestToURL(data: object): Promise<void> {
  const url = process.env.NEXT_PUBLIC_WEBHOOK_URL;

  if (!url) {
    console.error('WEBHOOK_URL is not set in environment variables.');
    console.log(url)
    return;
  }

  try {
    await axios.post(url, data);
  } catch (error) {
    console.error('Error sending POST request to URL:', error);
  }
}
