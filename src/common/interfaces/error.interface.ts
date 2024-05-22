export interface ErrorInterface {
  status: boolean;
  message: string;
  data: any;
  error?: Error;
  name?: string;
}
