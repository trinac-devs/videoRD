import {AxiosError} from 'axios';

export const parseAxiosError = (error: AxiosError): string => {
  let errorString: string = 'Something went wrong, please try again';

  let modifiedError: AxiosError<{
    status: 'fail';
    errors: {message: string}[];
  }>;

  // @ts-ignore
  modifiedError = error;

  if (modifiedError.response) {
    if (modifiedError.response.data.errors) {
      errorString = modifiedError.response.data.errors[0].message;
    }
  }

  return errorString;
};
