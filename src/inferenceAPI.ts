// API Configuration
const API_BASE_URL = "https://kalpokoch-chatbotdemo.hf.space";
const COLD_START_ESTIMATE_MS = 270000; // 4.5 minutes in milliseconds
const INITIAL_RETRY_DELAY_MS = 5000; // Start with 5 seconds
const MAX_RETRY_DELAY_MS = 30000; // Max 30 seconds between retries
const MAX_RETRIES = 36; // Maximum retries (about 6 minutes with exponential backoff)

/**
 * Defines the structure for the request sent to the chatbot API.
 */
export interface ChatRequest {
  question: string;
}

/**
 * Defines the structure of the JSON response received from the chatbot API.
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
  status: 'processing' | 'queued' | 'queue_full' | 'sleeping';
  message: string;
  queue_position?: number;
  estimated_wait_time?: string;
}

/**
 * Defines the structure of the status response from the status endpoint.
 */
export interface StatusResponse {
  request_id: string;
  status: 'processing' | 'queued' | 'completed' | 'failed' | 'sleeping';
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
  status: 'processing' | 'queued' | 'completed' | 'failed' | 'queue_full' | 'sleeping';
  message: string;
  queuePosition?: number;
  estimatedWaitTime?: string;
  result?: EnhancedChatResponse;
  error?: string;
}

/**
 * Progress callback for tracking backend wake-up and retry attempts.
 */
export interface RetryProgress {
  attempt: number;
  maxAttempts: number;
  timeElapsed: number;
  estimatedTotal: number;
  nextRetryIn: number;
}

/**
 * Checks if an error response indicates the backend is sleeping (cold start).
 * @param status - HTTP status code
 * @returns boolean - true if backend is sleeping
 */
const isBackendSleeping = (status: number): boolean => {
  return status === 503 || status === 504;
};

/**
 * Calculates exponential backoff delay with jitter.
 * @param attempt - Current retry attempt number
 * @returns Delay in milliseconds
 */
const calculateBackoffDelay = (attempt: number): number => {
  const exponentialDelay = Math.min(
    INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt),
    MAX_RETRY_DELAY_MS
  );
  // Add jitter (random ±20%) to prevent thundering herd
  const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5);
  return Math.floor(exponentialDelay + jitter);
};

/**
 * Sends a question to the backend chatbot API with automatic retry on sleeping state.
 * The initial request itself triggers the backend to wake up from sleep mode.
 * @param request - The ChatRequest object containing the user's question.
 * @param onProgress - Optional callback for wake-up progress updates
 * @returns A Promise that resolves to a QueueResponse object.
 */
export const askQuestion = async (
  request: ChatRequest,
  onProgress?: (progress: RetryProgress) => void
): Promise<QueueResponse> => {
  const apiUrl = `${API_BASE_URL}/chat`;
  const startTime = Date.now();
  let retryCount = 0;
  let lastError: Error | null = null;

  // This loop will retry the request if backend is sleeping
  while (retryCount <= MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if backend is sleeping (503/504 error)
      if (isBackendSleeping(res.status)) {
        console.log(`Backend is sleeping (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // First time detecting sleep, return sleeping status immediately
        if (retryCount === 0) {
          // Return sleeping status but continue retrying in background
          const sleepingResponse: QueueResponse = {
            request_id: `waking-${Date.now()}`,
            question: request.question,
            status: 'sleeping',
            message: 'Backend is waking up... Your query has been sent and will be processed once the server starts.',
            estimated_wait_time: '4-5 minutes',
          };

          // Continue retrying in background
          retryCount++;
          const backoffDelay = calculateBackoffDelay(retryCount);
          
          if (onProgress) {
            onProgress({
              attempt: retryCount,
              maxAttempts: MAX_RETRIES,
              timeElapsed: Date.now() - startTime,
              estimatedTotal: COLD_START_ESTIMATE_MS,
              nextRetryIn: backoffDelay,
            });
          }

          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          continue; // Retry the request
        }

        // Subsequent retries
        retryCount++;
        if (retryCount > MAX_RETRIES) {
          throw new Error('Backend failed to wake up after maximum retries');
        }

        const backoffDelay = calculateBackoffDelay(retryCount);
        
        if (onProgress) {
          onProgress({
            attempt: retryCount,
            maxAttempts: MAX_RETRIES,
            timeElapsed: Date.now() - startTime,
            estimatedTotal: COLD_START_ESTIMATE_MS,
            nextRetryIn: backoffDelay,
          });
        }

        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue; // Retry the request
      }

      // Check if the request was successful
      if (!res.ok) {
        const errorBody = await res.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`Failed to fetch response. Status: ${res.status}`);
      }

      // Success! Parse and return the response
      const data: QueueResponse = await res.json();
      console.log(`Request successful after ${retryCount} retries, took ${(Date.now() - startTime) / 1000}s`);
      return data;

    } catch (error: any) {
      lastError = error;

      // Handle timeout errors (might indicate sleeping backend)
      if (error.name === 'AbortError') {
        console.error(`Request timeout (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        if (retryCount === 0) {
          // First timeout, assume backend is sleeping
          retryCount++;
          const backoffDelay = calculateBackoffDelay(retryCount);
          
          if (onProgress) {
            onProgress({
              attempt: retryCount,
              maxAttempts: MAX_RETRIES,
              timeElapsed: Date.now() - startTime,
              estimatedTotal: COLD_START_ESTIMATE_MS,
              nextRetryIn: backoffDelay,
            });
          }

          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          continue; // Retry
        }
        
        retryCount++;
        if (retryCount > MAX_RETRIES) {
          throw new Error('Backend failed to respond after maximum retries');
        }

        const backoffDelay = calculateBackoffDelay(retryCount);
        
        if (onProgress) {
          onProgress({
            attempt: retryCount,
            maxAttempts: MAX_RETRIES,
            timeElapsed: Date.now() - startTime,
            estimatedTotal: COLD_START_ESTIMATE_MS,
            nextRetryIn: backoffDelay,
          });
        }

        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue; // Retry
      }

      // For non-timeout errors, throw immediately
      console.error("An error occurred while fetching from the chat API:", error);
      throw error;
    }
  }

  // If we've exhausted all retries
  throw new Error(`Failed to get response after ${MAX_RETRIES} retries: ${lastError?.message}`);
};

/**
 * Checks the status of a specific request using its request ID with retry logic.
 * @param requestId - The request ID to check status for.
 * @param onProgress - Optional callback for retry progress
 * @returns A Promise that resolves to a StatusResponse object.
 */
export const checkRequestStatus = async (
  requestId: string,
  onProgress?: (progress: RetryProgress) => void
): Promise<StatusResponse> => {
  const apiUrl = `${API_BASE_URL}/status/${requestId}`;
  const startTime = Date.now();
  let retryCount = 0;

  while (retryCount <= MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle sleeping backend
      if (isBackendSleeping(res.status)) {
        if (retryCount === 0) {
          // Return sleeping status on first attempt
          return {
            request_id: requestId,
            status: 'sleeping',
            message: 'Backend is waking up. Please wait...',
            estimated_wait_time: '4-5 minutes',
          };
        }

        retryCount++;
        if (retryCount > MAX_RETRIES) {
          throw new Error('Backend failed to wake up');
        }

        const backoffDelay = calculateBackoffDelay(retryCount);
        
        if (onProgress) {
          onProgress({
            attempt: retryCount,
            maxAttempts: MAX_RETRIES,
            timeElapsed: Date.now() - startTime,
            estimatedTotal: COLD_START_ESTIMATE_MS,
            nextRetryIn: backoffDelay,
          });
        }

        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }

      if (!res.ok) {
        const errorBody = await res.text();
        console.error("Status API Error Response:", errorBody);
        throw new Error(`Failed to check request status. Status: ${res.status}`);
      }

      const data: StatusResponse = await res.json();
      return data;

    } catch (error: any) {
      if (error.name === 'AbortError' && retryCount < MAX_RETRIES) {
        retryCount++;
        const backoffDelay = calculateBackoffDelay(retryCount);
        
        if (onProgress) {
          onProgress({
            attempt: retryCount,
            maxAttempts: MAX_RETRIES,
            timeElapsed: Date.now() - startTime,
            estimatedTotal: COLD_START_ESTIMATE_MS,
            nextRetryIn: backoffDelay,
          });
        }

        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }

      console.error("An error occurred while checking request status:", error);
      throw error;
    }
  }

  throw new Error('Maximum retries exceeded');
};

/**
 * Gets the current queue information.
 * @returns A Promise that resolves to queue information.
 */
export const getQueueInfo = async (): Promise<any> => {
  const apiUrl = `${API_BASE_URL}/queue`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
  const apiUrl = `${API_BASE_URL}/feedback`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Feedback API Error Response:", errorBody);
      throw new Error(`Failed to submit feedback. Status: ${res.status}`);
    }

    const data: FeedbackResponse = await res.json();
    return data;

  } catch (error) {
    console.error("An error occurred while submitting feedback:", error);
    throw error;
  }
};

/**
 * Checks the health status of the backend API.
 * @returns A Promise that resolves to the health status response.
 */
export const checkHealth = async (): Promise<any> => {
  const apiUrl = `${API_BASE_URL}/health`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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

/**
 * Helper function to format milliseconds into a readable time string
 * @param ms - Time in milliseconds
 * @returns Formatted string like "2 min 30 sec"
 */
export const formatWaitTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes} min ${seconds} sec`;
  }
  return `${seconds} sec`;
};

/**
 * Helper function to format retry progress for display
 * @param progress - RetryProgress object
 * @returns Formatted string for user display
 */
export const formatRetryProgress = (progress: RetryProgress): string => {
  const elapsedTime = formatWaitTime(progress.timeElapsed);
  const nextRetry = formatWaitTime(progress.nextRetryIn);
  return `Attempt ${progress.attempt}/${progress.maxAttempts} - Elapsed: ${elapsedTime} - Next retry in: ${nextRetry}`;
};
