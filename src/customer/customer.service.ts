import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StoreService } from '../store/store.service';
import { GetListOfCustomersResponse } from '../../types/customer';
import axios from 'axios';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import {createResponse, ResponseData} from "../utils/createResponse";

@Injectable()
export class CustomerService {
  constructor(
    private dataSource: DataSource,
    private storeService: StoreService,
    private userService: UserService,
  ) {}

  async getAllCustomers(user: UserEntity): Promise<GetListOfCustomersResponse> {
    const store = await this.storeService.getStoreByUserId(user.id);
    const userEntity = await this.userService.getByEmail(user.email);

    const url = `${store.store_url}/wp-json/wp/v2/users/`;
    const token = userEntity.wpTokenAuth;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await axios.get(url, { headers });
      const customers = res.data || [];
      for (const customer of customers) {
        const userId = customer.id;
        const metaUrl = `${store.store_url}/wp-json/wp/v2/users/${userId}`;
        const metaRes = await axios.get(metaUrl, { headers });

        const customerMeta = metaRes.data.meta;
        console.log('Meta dla użytkownika:', customerMeta);
      }
      return customers;
    } catch (e) {
      return []
      // throw new HttpException(
      //   {
      //     message: `Coś poszło nie tak, spróbuj raz jeszcze.`,
      //     isSuccess: false,
      //   },
      //   HttpStatus.BAD_REQUEST,
      // );
    }
  }

  async updateStatus(id, status: string, user: any) {
    const store = await this.storeService.getStoreByUserId(user.id);
    const userEntity = await this.userService.getByEmail(user.email);
    const url = `${store.store_url}/wp-json/wp/v2/users/${id}`;

    const data = {
      meta: {
        pw_user_status: status,
      },
    };

    try {
      const res = await axios.put(url, data);

      // Przygotuj odpowiedź na podstawie interfejsu ResponseData
      const responseData: ResponseData = createResponse(true, 'Statuś pomyślnie zaaktualizowany.', res.status, res.data);

      // Przyda się dostęp do responseData w przypadku obsługi dalszych logik w kodzie

      return responseData;
    } catch (error) {
      // W przypadku błędu również przygotuj odpowiedź z błędem
      console.log(error)
      const responseData: ResponseData = createResponse(false, 'Failed to update status', error.response?.status || 500);

      // Możesz również dostosować informacje o błędzie w responseData, jeśli to konieczne

      return responseData;
    }
  }
}
