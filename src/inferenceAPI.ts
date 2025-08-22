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
 * Defines the structure of the queue response from the chatbot API.
 */
export interface QueueResponse {
  request_id: string;
  question: string;
  status: 'processing' | 'queued' | 'queue_full';
  message: string;
  queue_position?: number;
  estimated_wait_time?: string;
}

/**
 * Defines the structure of the status response from the status endpoint.
 */
export interface StatusResponse {
  request_id: string;
  status: 'processing' | 'queued' | 'completed' | 'failed';
  message: string;
  queue_position?: number;
  estimated_wait_time?: string;
  result?: ChatResponse;
  error?: string;
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
 * Queue status object for tracking request progress.
 */
export interface QueueStatus {
  status: 'processing' | 'queued' | 'completed' | 'failed' | 'queue_full';
  message: string;
  queuePosition?: number;
  estimatedWaitTime?: string;
  result?: EnhancedChatResponse;
  error?: string;
}

/**
 * Sends a question to the backend chatbot API and returns the queue response.
 * @param request - The ChatRequest object containing the user's question.
 * @returns A Promise that resolves to a QueueResponse object with queue status information.
 */
export const askQuestion = async (
  request: ChatRequest
): Promise<QueueResponse> => {
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
    const data: QueueResponse = await res.json();
    return data;

  } catch (error) {
    console.error("An error occurred while fetching from the chat API:", error);
    // Re-throw the error to be handled by the calling component.
    throw error;
  }
};

/**
 * Checks the status of a specific request using its request ID.
 * @param requestId - The request ID to check status for.
 * @returns A Promise that resolves to a StatusResponse object.
 */
export const checkRequestStatus = async (
  requestId: string
): Promise<StatusResponse> => {
  const apiUrl = `https://kalpokoch-chatbotdemo.hf.space/status/${requestId}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Status API Error Response:", errorBody);
      throw new Error(`Failed to check request status. Status: ${res.status}`);
    }

    const data: StatusResponse = await res.json();
    return data;

  } catch (error) {
    console.error("An error occurred while checking request status:", error);
    throw error;
  }
};

/**
 * Gets the current queue information.
 * @returns A Promise that resolves to queue information.
 */
export const getQueueInfo = async (): Promise<any> => {
  const apiUrl = "https://kalpokoch-chatbotdemo.hf.space/queue";

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to get queue info. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("An error occurred while fetching queue info:", error);
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