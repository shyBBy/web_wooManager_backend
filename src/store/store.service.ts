import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {StoreCreateDto} from './dto/create-store.dto';
import {StoreEntity} from './entities/store.entity';
import {createResponse} from '../utils/createResponse';
import {UserEntity} from '../user/entities/user.entity';

import {createAuthHeadersFromStoreCredentials} from '../utils/createAuthHeadersFromStoreCredentials';
import {Cron, CronExpression} from "@nestjs/schedule";
import {CouponCreateDto} from "./dto/createCoupon.dto";
import axios from "axios";
import { getToken } from 'src/utils/furgonetkaGetToken.utils';

@Injectable()
export class StoreService {
  constructor(private dataSource: DataSource) {}

  async create(storeCreateDto: StoreCreateDto, id) {
    const {name, url, consumer_key, consumer_secret} = storeCreateDto;

    const isStoreExist = await StoreEntity.findOneBy({url});

    if (isStoreExist) {
        throw new HttpException(
            {
                message: `Sklep, który próbujesz dodać już istnieje w bazie danych..`,
                isSuccess: false,
            },
            HttpStatus.BAD_REQUEST,
        );
    }

    const furgonetka_access_token = await getToken();
    const user = await UserEntity.findOneBy({id});

    const store = new StoreEntity();
    store.url = url;
    store.name = name;
    store.consumer_secret = consumer_secret;
    store.consumer_key = consumer_key;
    store.user_profile = user;
    store.furgonetka_access_token = furgonetka_access_token;
    await store.save();
    return createResponse(true, `Pomyślnie skonfigurowano sklep`, 200);
}

public async getStoreByUserId(user_id: string): Promise<any> {
    const user = await UserEntity.findOneBy({id: user_id});
    const store = user.store;
    const headers = createAuthHeadersFromStoreCredentials(
        store.consumer_key,
        store.consumer_secret,
    );
    return {
        store_url: store.url,
        headers,
        furgonetka_access_token: store.furgonetka_access_token,
    };
}

async getOneById(id: string): Promise<any> {
    const store = await StoreEntity.findOneBy({id});
    return {
        store_url: store.url,
        store_name: store.name,
    };
}

// @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
// async refreshFurgonetkaToken() {
//     try {
//         const store_url = process.env.WOOCOMMERCE_STORE_URL
//         const store = await StoreEntity.findOneBy({url: store_url})
//         const furgonetka_access_token = await getToken();
//         store.furgonetka_access_token = furgonetka_access_token
//         await store.save()
//         return createResponse(true, 'Pomyślnie zaaktualizowano token', 200)
//     } catch (e) {
//         return createResponse(false, `Coś poszło nie tak`, 400)
//     }
// }


async fetchStore(storeUrl: string): Promise<StoreEntity | null> {
    try {
        const store = await StoreEntity.findOneBy({ url: storeUrl });
        if (!store) {
            console.error('Nie znaleziono sklepu z podanym URL:', storeUrl);
            return null;
        }
        return store;
    } catch (error) {
        console.error('Błąd podczas pobierania sklepu:', error);
        throw new Error('Błąd podczas pobierania sklepu');
    }
}

async fetchNewToken(): Promise<string | null> {
    try {
        const token = await getToken();
        if (!token) {
            console.error('Nie udało się pobrać nowego tokenu');
            return null;
        }
        return token;
    } catch (error) {
        console.error('Błąd podczas pobierania nowego tokenu:', error);
        throw new Error('Błąd podczas pobierania nowego tokenu');
    }
}

async updateStoreToken(store: StoreEntity, token: string): Promise<boolean> {
    try {
        store.furgonetka_access_token = token;
        await store.save();
        console.log('Token został pomyślnie zapisany:', token);
        return true;
    } catch (error) {
        console.error('Błąd podczas aktualizacji tokenu w bazie danych:', error);
        return false;
    }
}


@Cron(CronExpression.EVERY_WEEK)
async refreshFurgonetkaToken() {
const storeUrl = process.env.WOOCOMMERCE_STORE_URL;

try {
    // Krok 1: Pobranie encji sklepu
    const store = await this.fetchStore(storeUrl);
    if (!store) {
        return createResponse(false, 'Nie znaleziono sklepu z podanym URL', 404);
    }

    // Krok 2: Pobranie nowego tokenu
    const newToken = await this.fetchNewToken();
    if (!newToken) {
        return createResponse(false, 'Nie udało się pobrać nowego tokenu', 400);
    }

    // Krok 3: Zaktualizowanie tokenu w bazie danych
    const updateSuccess = await this.updateStoreToken(store, newToken);
    if (!updateSuccess) {
        return createResponse(false, 'Błąd podczas aktualizacji tokenu w bazie danych', 500);
    }

    return createResponse(true, 'Pomyślnie zaaktualizowano token', 200);
} catch (error) {
    console.error('Błąd podczas odświeżania tokenu Furgonetka:', error);
    return createResponse(false, 'Wystąpił nieoczekiwany błąd', 500);
}
}


//COUPON SECTION START


async createCoupon(createCouponDto: CouponCreateDto, userUuid: string) {

    const {
        code,
        date_expires,
        date_expires_gmt,
        exclude_sale_items,
        usage_limit_per_user,
        individual_use,
        minimum_amount,
        amount,
        discount_type,
        description
    } = createCouponDto

    const data = {
        code,
        discount_type,
        description,
        date_expires,
        usage_limit_per_user,
        amount,
        individual_use,
        exclude_sale_items,
        minimum_amount,
    };

    const store = await this.getStoreByUserId(userUuid)
    const url = `${store.store_url}/wp-json/wc/v3/coupons`;

    try {
        const res = await axios.post(url, data, {
            headers: store.headers
        });
        const response = res.data || {};
        return createResponse(true, `Git`, 200)
    } catch (e) {
        console.log(e)
        return createResponse(false, `Coś poszło nie tak`, 400)
    }

}


async listAllCoupons(userUuid: string): Promise<any> {
    const store = await this.getStoreByUserId(userUuid)
    const url = `${store.store_url}/wp-json/wc/v3/coupons`;

    try {
        const res = await axios.get(url, {
            headers: store.headers,
        })

        const coupons = res.data || []
        return coupons

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

}

async getOneCouponById(coupon_id, user_uuid): Promise<any> {
    const store = await this.getStoreByUserId(user_uuid)
    const url = `${store.store_url}/wp-json/wc/v3/coupons/${coupon_id}`;

    try {
        const res = await axios.get(url, {headers: store.headers});
        const couponRes = res.data || {};
        return couponRes
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
}

async deleteCoupon(coupon_id, user_uuid) {
    const store = await this.getStoreByUserId(user_uuid)
    const url = `${store.store_url}/wp-json/wc/v3/coupons/${coupon_id}`;
    try {
        const res = await axios.delete(url,{
            headers: store.headers,
            params: {
                force: true
            }
        });
        return createResponse(true, `Pomyślnie usunięto kupon`, 200)
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

}

//COUPON SECTION END
}
