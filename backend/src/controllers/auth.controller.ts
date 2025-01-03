import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { handleDates } from '../middleware/dateHandler.middleware';

export class AuthController {
  private authService: AuthService;
  public router: Router;

  constructor() {
    this.authService = new AuthService();
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/register', handleDates, this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.authService.register(req.body);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error in register:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { token, user } = await this.authService.login(req.body);
      res.status(200).json({ token, user });
    } catch (error) {
      console.error('Error in login:', error);
      if (error instanceof Error && error.message.includes('Invalid')) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 