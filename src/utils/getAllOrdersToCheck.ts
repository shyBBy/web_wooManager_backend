import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createAuthHeadersFromStoreCredentials } from './createAuthHeadersFromStoreCredentials';

export const getAllOrdersToCheck = async () => {
  const url = `${process.env.STORE_URL}/wp-json/wc/v3/orders`;
  const storeHeaders = createAuthHeadersFromStoreCredentials(
    `${process.env.STORE_CONSUME}`,
    `${process.env.STORE_SECRET_KEY}`,
  );
  try {
    const res = await axios.get(url, {
      headers: storeHeaders,
      params: {
        per_page: 40,
      },
    });
    const orders = res.data || [];
    return orders;
  } catch (e) {
    console.log(e);
    throw new HttpException(
      {
        message: `Coś poszło nie tak, spróbuj raz jeszcze.`,
        isSuccess: false,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
};
