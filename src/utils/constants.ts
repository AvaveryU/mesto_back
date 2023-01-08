export const ERROR_SERVER = 500;
export const ERROR_NOT_FOUND = 404;
export const ERROR_ACCESS_CLOSED = 403;
export const ERROR_UNCORRECT_DATA = 400;
export const ERROR_AUTH = 401;
export const SUCCESS_REQUEST = 200;
/* eslint-disable */
export const validationLink = new RegExp(/^http[s]?:\/\/(www\.)?[A-Za-z0-9-._~:\/?#@!$&'()*+,;=]{1,}\.[A-Za-z0-9]{1,}\b[-a-zA-Z0-9-._~:\/?#@!$&'()*+,;=]*$/);
export const validationEmail = new RegExp(/(^|\s+)([A-Za-z0-9_\-\\.]+)(@{0,1}[A-Za-z0-9_\-]{1,}\.[A-Za-z]{2,}){0,}(\s+){0,}$/);
