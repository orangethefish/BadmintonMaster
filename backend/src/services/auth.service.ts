import { UserModel, LoginRequest, RegisterRequest } from '../data-models/user.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { generateUUID } from '../utils/uuid.util';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export class AuthService {
  public async register(request: RegisterRequest): Promise<UserModel> {
    // Check if username or email already exists
    const existingUser = await this.findUserByUsernameOrEmail(request.username, request.email);
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(request.password, SALT_ROUNDS);

    return new Promise((resolve, reject) => {
      const userId = generateUUID();
      const sql = `INSERT INTO User (
        UserId, Username, Password, Email, FirstName, LastName,
        Deleted, DateCreated, DateModified, DateDeleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const now = new Date().toISOString();
      const params = [
        userId,
        request.username,
        hashedPassword,
        request.email,
        request.firstName,
        request.lastName,
        false,
        now,
        now,
        null
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error registering user:', err);
          reject(err);
          return;
        }
        try {
          const user = await self.getUserById(userId);
          resolve(user);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async login(request: LoginRequest): Promise<{ token: string; user: UserModel }> {
    const user = await this.findUserByUsername(request.username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword as UserModel
    };
  }

  private generateToken(user: UserModel): string {
    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  private async findUserByUsername(username: string): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          UserId as userId,
          Username as username,
          Password as password,
          Email as email,
          FirstName as firstName,
          LastName as lastName,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted
        FROM User 
        WHERE Username = ? AND (Deleted = false OR Deleted IS NULL)`;
      
      db.get(sql, [username], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || null);
      });
    });
  }

  private async findUserByUsernameOrEmail(username: string, email: string): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          UserId as userId,
          Username as username,
          Password as password,
          Email as email,
          FirstName as firstName,
          LastName as lastName
        FROM User 
        WHERE (Username = ? OR Email = ?) AND (Deleted = false OR Deleted IS NULL)`;
      
      db.get(sql, [username, email], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || null);
      });
    });
  }

  private async getUserById(id: string): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          UserId as userId,
          Username as username,
          Password as password,
          Email as email,
          FirstName as firstName,
          LastName as lastName,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted
        FROM User 
        WHERE UserId = ?`;
      
      db.get(sql, [id], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('User not found'));
          return;
        }
        resolve(row);
      });
    });
  }
} 