// src/api/chatApi.ts

/**
 * Defines the structure for the request sent to the chatbot API.
 */
export interface ChatRequest {
  question: string;
}

/**
 * Defines the structure of the JSON response received from the chatbot API.
 * This includes the request ID, original question, the context the model used, and the final answer.
 */
export interface ChatResponse {
  request_id: string;
  question: string;
  context_used: string;
  answer: string;
}

/**
 * Defines the structure for feedback data sent to the backend.
 */
export interface FeedbackRequest {
  request_id: string;
  question: string;
  answer: string;
  context_used: string;
  feedback: string;
  comment?: string;
}

/**
 * Defines the structure of the feedback response from the backend.
 */
export interface FeedbackResponse {
  status: string;
}

/**
 * Enhanced response object that includes all necessary data for the frontend.
 */
export interface EnhancedChatResponse {
  answer: string;
  requestId: string;
  context: string;
}

/**
 * Sends a question to the backend chatbot API and returns the enhanced response object.
 * @param request - The ChatRequest object containing the user's question.
 * @returns A Promise that resolves to an EnhancedChatResponse object with answer, requestId, and context.
 */
export const askQuestion = async (
  request: ChatRequest
): Promise<EnhancedChatResponse> => {
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
    
    // Return the enhanced response object with all necessary data for the frontend.
    return {
      answer: data.answer,
      requestId: data.request_id,
      context: data.context_used
    };

  } catch (error) {
    console.error("An error occurred while fetching from the chat API:", error);
    // Re-throw the error to be handled by the calling component.
    throw error;
  }
};

/**
 * Submits user feedback for a specific chat response to the backend.
 * @param feedbackData - The FeedbackRequest object containing all feedback information.
 * @returns A Promise that resolves to the FeedbackResponse from the backend.
 */
export const submitFeedback = async (
  feedbackData: FeedbackRequest
): Promise<FeedbackResponse> => {
  // The endpoint for the feedback API.
  const apiUrl = "https://kalpokoch-chatbotdemo.hf.space/feedback";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });

    // Check if the request was successful. If not, throw an error.
    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Feedback API Error Response:", errorBody);
      throw new Error(`Failed to submit feedback. Status: ${res.status}`);
    }

    // Parse the JSON response from the API.
    const data: FeedbackResponse = await res.json();
    
    return data;

  } catch (error) {
    console.error("An error occurred while submitting feedback:", error);
    // Re-throw the error to be handled by the calling component.
    throw error;
  }
};

/**
 * Checks the health status of the backend API.
 * @returns A Promise that resolves to the health status response.
 */
export const checkHealth = async (): Promise<any> => {
  const apiUrl = "https://kalpokoch-chatbotdemo.hf.space/health";

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Health check failed. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("An error occurred while checking API health:", error);
    throw error;
  }
};
