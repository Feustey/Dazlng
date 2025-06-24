export const logApiCall = async (endpoint: string, duration: number, success: boolean) => {
  console.log(`API Call: ${endpoint}, Duration: ${duration}ms, Success: ${success}`);
}
