export interface AuthCallbackResponse {
  cookie(name: 'AccessToken' | 'RefreshToken', val: string): this;
  redirect(url: string): void;
}
