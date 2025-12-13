export class ApiResponse {
  static json<T>(data: T, status = 200) {
    return Response.json({ success: true, data }, { status });
  }

  static created<T>(data: T) {
    return this.json(data, 201);
  }

  static noContent() {
    return new Response(null, { status: 204 });
  }

  static error(message: string, status = 400, code?: string) {
    return Response.json(
      {
        success: false,
        error: { message, code },
      },
      { status }
    );
  }
}
