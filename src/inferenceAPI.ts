// src/api/chatApi.ts

/**
 * Defines the structure for the request sent to the chatbot API.
 */
export interface ChatRequest {
  question: string;
}

/**
 * Defines the structure of the JSON response received from the chatbot API.
 * This includes the original question, the context the model used, and the final answer.
 */
export interface ChatResponse {
  question: string;
  context_used: string;
  answer: string;
}

/**
 * Sends a question to the backend chatbot API and returns only the answer string.
 * @param request - The ChatRequest object containing the user's question.
 * @returns A Promise that resolves to the answer string from the API response.
 */
export const askQuestion = async (
  request: ChatRequest
): Promise<string> => {
  // The endpoint for the FastAPI backend.
  const apiUrl = "https://kalpokoch-chatbotdemo.hf.space/chat";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Check if the request was successful. If not, throw an error.
    if (!res.ok) {
      const errorBody = await res.text();
      console.error("API Error Response:", errorBody);
      throw new Error(`Failed to fetch response. Status: ${res.status}`);
    }

    // Parse the JSON response from the API.
    const data: ChatResponse = await res.json();
    
    // Return only the 'answer' field from the response object.
    return data.answer;

  } catch (error) {
    console.error("An error occurred while fetching from the chat API:", error);
    // Re-throw the error to be handled by the calling component.
    throw error;
  }
};
