/** represents the profile information on a user directly fetched from google 
  * after successful authentication with OAuth 2.0 */
export interface GoogleUserProflie {
    googleId: string, // unique ID google assigns to our user just for our app
    displayName: string, // full name from google
    firstName: string,
    lastName: string,
    email: string, 
    picture?: string // profile picture
}