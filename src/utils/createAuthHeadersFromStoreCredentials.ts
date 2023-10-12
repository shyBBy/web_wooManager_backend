import { encode } from 'base-64';

export const createAuthHeadersFromStoreCredentials = (
  consumer_key,
  consumer_secret,
) => {
  const auth = encode(`${consumer_key}:${consumer_secret}`);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${auth}`,
  };

  return headers;
};
