// lib/apiClient.ts
async function postToWebhook(task: object): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_WEBHOOK_URL;

  if (!url) {
    console.error('WEBHOOK_URL is not set in environment variables.');
    return false;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      console.error('Error calling the API route:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error posting to webhook:', error);
    return false;
  }
}

async function sendNotify(task: object): Promise<boolean> {
  try {
    const response = await fetch('/api/postNotify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      console.error('Error calling the API route:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error posting to webhook:', error);
    return false;
  }
}

export { postToWebhook, sendNotify };
