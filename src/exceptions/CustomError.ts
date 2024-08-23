export class CustomError extends Error {
  private statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // Chama o construtor da classe Error
    this.statusCode = statusCode; // Define o código de status HTTP
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}
