export interface LoginResponse {
  token: string;
  token_expire?: Date;
  username?: string;
  password?: string;
}
export interface UserData {
  id: string;
  email: string;
  name: string;
  notifications: number;
  profile: string;
}

export class AuthService {
  #token?: string;

  public get token(): string | undefined {
    return this.#token;
  }

  public async login(email: string, password: string): Promise<string> {
    const response = await fetch('https://api.kickbase.com/v4/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ em: email, pass: password, loy: false, rep: {} })
    });

    const responseJson = await response.json();
    this.#token = responseJson.tkn ?? responseJson.token;
    return this.#token;
  }
}

export const authService = new AuthService();
