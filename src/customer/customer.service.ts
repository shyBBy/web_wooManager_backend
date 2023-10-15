import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StoreService } from '../store/store.service';
import {GetListOfCustomersResponse, GetPaginatedListOfAllCustomersResponse} from '../../types/customer';
import axios from 'axios';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import {createResponse, ResponseData} from "../utils/createResponse";

export interface PaginationInfo {
  totalPages: number;
  totalUsers: number;
  currentPage: number;
}

@Injectable()
export class CustomerService {
  constructor(
    private dataSource: DataSource,
    private storeService: StoreService,
    private userService: UserService,
  ) {}

  async getAllCustomers(
      user: UserEntity,
      page: number = 1,
      perPage: number = 10
  ): Promise<GetPaginatedListOfAllCustomersResponse> {
    const store = await this.storeService.getStoreByUserId(user.id);
    const userEntity = await this.userService.getByEmail(user.email);

    const url = `${store.store_url}/wp-json/wp/v2/users/`;
    const token = userEntity.wpTokenAuth;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = {
      page,
      per_page: perPage,
    };

    try {
      const res = await axios.get(url, { headers, params });
      const customers = res.data || [];
      for (const customer of customers) {
        const userId = customer.id;
        const metaUrl = `${store.store_url}/wp-json/wp/v2/users/${userId}`;
        const metaRes = await axios.get(metaUrl, { headers });

        const customerMeta = metaRes.data.meta;
      }
      const pagesCount = parseInt(res.headers['x-wp-totalpages'], 10);
      const resultsCount = parseInt(res.headers['x-wp-total'], 10);

      if (!resultsCount) {
        return {
          customers: [],
          pagesCount: 0,
          resultsCount: 0,
        }
      }

      return {
        customers,
        pagesCount,
        resultsCount,
      }

    } catch (e) {
      console.log(e)
      throw new HttpException(
          {
            message: `Cos poszlo nie tak, spróbuj raz jeszcze.`,
            isSuccess: false,
          },
          HttpStatus.BAD_REQUEST,
      );
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
