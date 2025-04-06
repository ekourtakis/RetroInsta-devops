import { User } from '../models/User'; // Adjust path as necessary

/**
 * Fetches user data by their MongoDB ID.
 * @param userId - The MongoDB _id of the user.
 * @param apiUrl - The base URL of the backend API.
 * @returns A promise that resolves to the User object.
 */
export const getUserDataByIdApi = async (userId: string, apiUrl: string): Promise<User> => {
  if (!apiUrl) throw new Error("Backend API URL is not configured.");
  if (!userId) throw new Error("User ID is required to fetch user data.");

  const targetUrl = `${apiUrl}/api/users/${userId}`;
  console.log(`[API] Fetching user data from: ${targetUrl}`);

  try {
      const response = await fetch(targetUrl);
      console.log(`[API] Fetch user by ID response status: ${response.status}`);

      const responseData = await response.json();

      if (!response.ok) {
          const errorMessage = responseData?.error || `Backend fetch user failed with status ${response.status}`;
          console.error(`[API] Error fetching user data: ${errorMessage}`, responseData);
          throw new Error(errorMessage);
      }

      if (!responseData?._id || !responseData?.email || !responseData?.username) {
          console.error("[API] Received invalid user data structure:", responseData);
          throw new Error("Received invalid user data structure from backend.");
      }

      console.log("[API] User data fetched successfully:", responseData);
      return responseData as User;

  } catch (error) {
      console.error(`[API] Network or parsing error fetching user ${userId}:`, error);
      if (error instanceof Error) throw error;
      throw new Error("An unknown error occurred while fetching user data.");
  }
};
