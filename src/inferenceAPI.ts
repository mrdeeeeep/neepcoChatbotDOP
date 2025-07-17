// src/api/chatApi.ts
export interface ChatRequest {
    question: string;
  }
  
  export interface ChatResponse {
    response: string;
  }
  
  export const askQuestion = async (
    request: ChatRequest
  ): Promise<string> => {
    const res = await fetch("https://kalpokoch-chatbotdemo.hf.space/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  
    if (!res.ok) throw new Error("Failed to fetch response");
  
    const data: ChatResponse = await res.json();
    return data.response;
  };
  