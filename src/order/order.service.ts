import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import axios from 'axios';
import { DataSource } from 'typeorm';
import { StoreService } from '../store/store.service';
import {createAuthHeadersFromStoreCredentials} from '../utils/createAuthHeadersFromStoreCredentials';
import {getTrackingNumberFromOrder} from "../utils/getTrackingNumberFromOrder";
import {updateStatus} from "../utils/updateStatus";
import {MailerService} from "@nestjs-modules/mailer";
import {Cron, CronExpression} from "@nestjs/schedule";
import {mailTemplate} from "../utils/mailTemplate";
import { FurgonetkaService } from 'src/furgonetka/furgonetka.service';
import { StoreEntity } from 'src/store/entities/store.entity';
import { OrderEntity } from './entities/order.entity';

import { GetListOfAllOrdersResponse, GetOneOrderResponse, OrderProfileInterface } from '../../types/order/order';
import { getAllOrdersToCheck } from 'src/utils/getAllOrdersToCheck';


@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource,
    private storeService: StoreService,
    private furgonetkaService: FurgonetkaService,
    private readonly mailerService: MailerService,
  ) {}

  async getAllOrders(user_id?: string, search?: string): Promise<GetListOfAllOrdersResponse> {
    const store = await this.storeService.getStoreByUserId(user_id);
    const url = `${store.store_url}/wp-json/wc/v3/orders`;

    try {
        const res = await axios.get(url, {
            headers: store.headers,
            params: {
                per_page: 100,
                search, // Dodano parametr search
            },
        });
        const orders: GetListOfAllOrdersResponse = res.data || [];
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
  }

  async getOneById(order_id: string, user_uuid: string): Promise<GetOneOrderResponse> {
    const store = await this.storeService.getStoreByUserId(user_uuid);
    const url = `${store.store_url}/wp-json/wc/v3/orders/${order_id}`;

    try {
        const res = await axios.get(url, { headers: store.headers });
        const orderRes = res.data || {};

        const tracking_number = await getTrackingNumberFromOrder(orderRes);
        if (tracking_number) {
            const onePackage = await this.furgonetkaService.getPackage(
                tracking_number,
                store.furgonetka_access_token,
            );

            const shippingTrackingHistory =
                await this.furgonetkaService.getShippingStatus(
                    onePackage.package_id,
                    store.furgonetka_access_token,
                );

            return {
                order: orderRes,
                shipping: onePackage,
                shipping_tracking: shippingTrackingHistory,
            };
        }

        return {
            order: orderRes,
            shipping: null,
            shipping_tracking: null,
        };
    } catch (e) {
        throw e;
    }
  }

  async checkStatusAndChange() {
    try {
      const orders = await getAllOrdersToCheck();
    } catch (e) {}
  }

  async updateStatus(url: string, store_headers: Record<string, string>): Promise<void> {
    try {
        const data = {
            status: 'in-transit',
        };
        await axios.put(url, data, { headers: store_headers });
    } catch (e) {
        throw e;
    }
  }

  async getSalesReport(user_id?: string, fromDate?: string) {
    const store = await this.storeService.getStoreByUserId(user_id);
    const url = `${store.store_url}/wp-json/wc/v3/reports/sales`;
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10); // Konwertuje na "YYYY-MM-DD" format

    if (typeof fromDate === 'undefined') {
      fromDate = '2023-05-06'
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

  async getOrdersReport(user_id?: string) {
    const store = await this.storeService.getStoreByUserId(user_id);
    const url = `${store.store_url}/wp-json/wc/v3/reports/orders/totals`;

    try {
      const res = await axios.get(url, { headers: store.headers });
      const ordersRes = res.data || {};
      return ordersRes
    } catch (e) {
      console.log(e)
    }
  }

  async getTopProductSales(user_id?: string) {
    const store = await this.storeService.getStoreByUserId(user_id);
    const url = `${store.store_url}/wp-json/wc/v3/reports/top_sellers`;

    try {

      const res = await axios.get(url, {
        headers: store.headers,
        params: {
          period: "year"
        }
      });
      const topProductSalesRes = res.data || {};
      const topProductSalesResWithImageArray = await Promise.all(topProductSalesRes.slice(0, 5).map(async (product) => {
        const imageUrlData = await this.getProductImageUrl(user_id, product.product_id);
        const data = {
          ...product,
          image: imageUrlData
        };
        return data;
      }));
      //W powyższym kodzie użyłem funkcji Promise.all, aby asynchronicznie pobrać adresy URL obrazków dla wszystkich pięciu produktów. Dzięki temu nie trzeba czekać na zakończenie jednego zapytania przed wykonaniem następnego, co przyspiesza działanie funkcji.//
      return topProductSalesResWithImageArray;
    } catch (e) {
      console.log(e);
    }
  }

  async getProductImageUrl(user_id?: string, product_id?: string | number) {
    const store = await this.storeService.getStoreByUserId(user_id);
    const url = `${store.store_url}/wp-json/wc/v3/products/${product_id}`;
    try {

      const res = await axios.get(url, {
        headers: store.headers,
      });
      const data = res.data;
      const image = {
        url: data.images[0].src
      }
      return image
    } catch (e) {
      console.log(e)
    }
  }

    async getOrdersInTransitOrProcessingWithPackageNumber(): Promise<OrderProfileInterface[]> {
        const url = `${process.env.STORE_URL}/wp-json/wc/v3/orders`;
        const storeHeaders = createAuthHeadersFromStoreCredentials(
            process.env.STORE_CONSUMER_KEY,
            process.env.STORE_CONSUMER_SECRET,
        );

        try {
            const res = await axios.get(url, {
                headers: storeHeaders,
                params: {
                    per_page: 30,
                },
            });
            const orders: OrderProfileInterface[] = res.data || [];
            const processingOrInTransitOrders = orders.filter(
                (order) => order.status === 'processing' || order.status === 'in-transit',
            );

            const ordersWithPackageNumber: OrderProfileInterface[] = [];
            processingOrInTransitOrders.forEach((order) => {
                const trackingInfo = order.meta_data.find((item) => item.key === 'tracking_info');
                if (trackingInfo && Object.keys(trackingInfo.value).length > 0) {
                    ordersWithPackageNumber.push(order);
                }
            });

            return ordersWithPackageNumber;
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

    //nazwa do zmiany
    @Cron(CronExpression.EVERY_2_HOURS)
    async getAllOrdersAndCheckStatusAndChangeIt() {
        const orders = await this.getOrdersInTransitOrProcessingWithPackageNumber();
        let ordersWithDeliveredStatus = []
        let ordersWithSendStatus = []

        const store_url = process.env.WOOCOMMERCE_STORE_URL
        const store = await StoreEntity.findOneBy({url: store_url})


        for (const order of orders) {//tego typu pętla pozwala na uzycie asynchronicznych funkcji w przeciwieństwie do forEach
            const url = `${process.env.STORE_URL}/wp-json/wc/v3/orders/${order.id}`;
            const tracking_number = await getTrackingNumberFromOrder(order);
            const shipping = await this.furgonetkaService.getPackage(tracking_number, store.furgonetka_access_token);
            const isOrderExist = await OrderEntity.findOneBy({order_id: order.id.toString()})
            if (!isOrderExist) { //jesli nie ma to tworzy nową encje w lokalnej bazie danych
                const newOrder = await new OrderEntity()
                newOrder.order_id = order.id.toString();
                newOrder.tracking_number = tracking_number;
                newOrder.state_description = order.status
                await newOrder.save()
            }
            if (shipping.parcels[0].state === 'collected' || shipping.parcels[0].state === 'transit') {
                const checkOrder = await OrderEntity.findOneBy({order_id: order.id.toString()})
                if (!checkOrder.notification_was_send) {
                        await this.mailerService.sendMail({
                            to: `${order.billing.email}`,
                            subject: 'Zamówienie z bigsewciu.shop zostało wysłane!',
                            text: 'Zlokalizuj swoją przesyłkę',
                            html: mailTemplate(shipping.parcels[0].tracking_url, order),
                        })
                    checkOrder.notification_was_send = true;
                    await checkOrder.save()
                }
                await updateStatus(url, 'in-transit')
                ordersWithSendStatus.push(order)
            } else if (shipping.parcels[0].state === 'delivered') {
                await updateStatus(url, 'completed')
                ordersWithDeliveredStatus.push(order)
            } else {
                console.log('')
            }
        }

        const response = {
            inTransit: ordersWithSendStatus,
            delivered: ordersWithDeliveredStatus
        }

        return response
    }
}
