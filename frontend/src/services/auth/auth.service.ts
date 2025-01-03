import { BaseApiService } from '../api/base.service';
import { LoginRequest, LoginResponse, RegisterRequest, UserModel } from '@/data-models/auth.model';

export class AuthService extends BaseApiService {
  private readonly endpoint = '/auth';
  protected readonly tokenKey = 'token';
  private readonly userKey = 'user';

  async register(request: RegisterRequest): Promise<UserModel> {
    return this.post<UserModel>(`${this.endpoint}/register`, request);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(`${this.endpoint}/login`, request);
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
    }
    return response;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): LoginResponse['user'] | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
} 