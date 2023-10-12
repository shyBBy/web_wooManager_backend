import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { StoreCreateDto } from './dto/create-store.dto';
import { createResponse } from '../utils/createResponse';
import { UserEntity } from '../user/entities/user.entity';
import { createAuthHeadersFromStoreCredentials } from '../utils/createAuthHeadersFromStoreCredentials';
import axios from "axios";

@Injectable()
export class StoreService {
  constructor(private dataSource: DataSource) {}

  async create(storeCreateDto: StoreCreateDto, id) {
    const { name, url, consumer_key, consumer_secret } = storeCreateDto;

    const isStoreExist = await StoreEntity.findOneBy({ url });

    if (isStoreExist) {
      throw new HttpException(
        {
          message: `Sklep, który próbujesz dodać już istnieje w bazie danych..`,
          isSuccess: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await UserEntity.findOneBy({ id });

    const store = new StoreEntity();
    store.url = url;
    store.name = name;
    store.consumer_secret = consumer_secret;
    store.consumer_key = consumer_key;
    store.user_profile = user;
    await store.save();
    return createResponse(true, `Pomyślnie skonfigurowano sklep`, 200);
  }

  public async getStoreByUserId(user_id: string): Promise<any> {
    const user = await UserEntity.findOneBy({ id: user_id });
    const store = user.store;
    const headers = createAuthHeadersFromStoreCredentials(
      store.consumer_key,
      store.consumer_secret,
    );
    return {
      store_url: store.url,
      headers,
    };
  }

  async getOneById(id: string): Promise<any> {
    const store = await StoreEntity.findOneBy({ id });
    return {
      store_url: store.url,
      store_name: store.name,
    };
  }



  async getSalesReport(user_id?: string, fromDate?: string) {
    const store = await this.getStoreByUserId(user_id);
    const url = `${store.store_url}/wp-json/wc/v3/reports/sales`;
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10); // Konwertuje na "YYYY-MM-DD" format

    if (typeof fromDate === 'undefined') {
      fromDate = '2023-10-01'
    }

    try {
      const res = await axios.get(url, {
        headers: store.headers,
        params: {
          date_min: fromDate,
          date_max: formattedToday
        }
      });
      const reportsRes = res.data || {};
      return reportsRes[0]
    } catch (e) {
      console.log(e)
    }
  }
}
