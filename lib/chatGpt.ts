// lib/chatGpt.ts
export async function fetchChatGptResponse(userMessage: string, messageHistory: any[]): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
    if (!apiKey) {
      throw new Error("API key is not set");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          max_tokens: 500,
          n: 1,
          stop: null,
          temperature: 0.5,
          messages: [
            ...messageHistory,
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      });
  
      const data = await response.json();
      if (data && data.choices && data.choices.length > 0) {
        return data.choices.at(-1)?.message?.content;
      } else {
        console.error("Error fetching ChatGPT response:", data);
        throw new Error("Error fetching ChatGPT response");
      }
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
      throw error;
    }
  }
  