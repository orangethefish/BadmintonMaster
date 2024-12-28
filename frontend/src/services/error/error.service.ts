export class ErrorService {
  static handle(error: any): string {
    // If it's a response error
    if (error.status) {
      return error.message || `Error: ${error.status}`;
    }

    // If it's a regular Error object
    if (error instanceof Error) {
      return error.message;
    }
    
    // If it's a string
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred';
  }

  static isHttpError(error: any): boolean {
    return error && typeof error.status === 'number';
  }
} 