export class CommonResponse<T> {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: T,
  ) {}
}
