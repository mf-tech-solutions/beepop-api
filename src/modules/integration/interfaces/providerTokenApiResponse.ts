export interface SpotifyTokenApiResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyTokenApiErrorResponse {
  error: string;
  error_description: string;
}
