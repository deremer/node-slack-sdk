import { AxiosError } from 'axios';

/**
 * All errors produced by this package adhere to this interface
 */
export interface CodedError extends NodeJS.ErrnoException {
  code: ErrorCode;
}

/**
 * A dictionary of codes for errors produced by this package
 */
export enum ErrorCode {
  IncomingWebhookRequestError = 'slack_webhook_request_error',
  IncomingWebhookHTTPError = 'slack_webhook_http_error',
}

export type IncomingWebhookSendError = IncomingWebhookRequestError | IncomingWebhookHTTPError;

export interface IncomingWebhookRequestError extends CodedError {
  code: ErrorCode.IncomingWebhookRequestError;
  original: Error;
}

export interface IncomingWebhookHTTPError extends CodedError {
  code: ErrorCode.IncomingWebhookHTTPError;
  original: Error;
}

/**
 * Factory for producing a {@link CodedError} from a generic error
 */
function errorWithCode(error: Error, code: ErrorCode): CodedError {
  // NOTE: might be able to return something more specific than a CodedError with conditional typing
  const codedError = error as Partial<CodedError>;
  codedError.code = code;
  return codedError as CodedError;
}

/**
 * A factory to create IncomingWebhookRequestError objects
 * @param original The original error
 */
export function requestErrorWithOriginal(original: AxiosError): IncomingWebhookRequestError {
  const error = errorWithCode(
    new Error(`A request error occurred: ${original.message}`),
    ErrorCode.IncomingWebhookRequestError,
  ) as Partial<IncomingWebhookRequestError>;
  error.original = original;
  return (error as IncomingWebhookRequestError);
}

/**
 * A factory to create IncomingWebhookHTTPError objects
 * @param original The original error
 */
export function httpErrorWithOriginal(original: AxiosError): IncomingWebhookHTTPError {
  const error = errorWithCode(
    new Error(`An HTTP protocol error occurred: statusCode = ${original.code}`),
    ErrorCode.IncomingWebhookHTTPError,
  ) as Partial<IncomingWebhookHTTPError>;
  error.original = original;
  return (error as IncomingWebhookHTTPError);
}
