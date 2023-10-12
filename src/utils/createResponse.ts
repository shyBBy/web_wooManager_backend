export interface ResponseData {
  message: string;
  isSuccess: boolean;
  statusCode: number;
  data?: any;
}

export const createResponse = (
  isSuccess: boolean,
  message: string,
  statusCode: number,
  data?: any,
) => {
  return {
    isSuccess,
    message,
    statusCode,
    ...(data ? { data } : {}),
  };
};
