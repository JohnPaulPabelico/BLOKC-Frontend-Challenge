const MAX_RETRIES = 5;
const BACKOFF_FACTOR = 2;

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 0
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 && retries < MAX_RETRIES) {
        const delay = Math.pow(BACKOFF_FACTOR, retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries + 1);
      }
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
