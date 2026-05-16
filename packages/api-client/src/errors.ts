export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(body: unknown = null) {
    super("Unauthorized", 401, body);
    this.name = "UnauthorizedError";
  }
}
