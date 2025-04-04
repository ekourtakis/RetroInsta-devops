import { JwtPayload } from 'jwt-decode';

// Define the same payload interface or import it
export interface GoogleIdTokenPayload extends JwtPayload {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}
