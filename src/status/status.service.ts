import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FurgonetkaService } from 'src/furgonetka/furgonetka.service';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderEntity } from 'src/order/entities/order.entity';
import { StoreEntity } from 'src/store/entities/store.entity';
import { createAuthHeadersFromStoreCredentials } from 'src/utils/createAuthHeadersFromStoreCredentials';
import { getTrackingNumberFromOrder } from 'src/utils/getTrackingNumberFromOrder';
import { mailTemplate } from 'src/utils/mailTemplate';
import { updateStatus } from 'src/utils/updateStatus';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class StatusService {
  constructor(
    private furgonetkaService: FurgonetkaService,
    private readonly mailerService: MailerService,
) {
}
  async getOrdersInTransitOrProcessingWithPackageNumber(store) {

    console.log('storeXX', store)
    const url = `${store.store_url}/wp-json/wc/v3/orders`;

    try {
        const res = await axios.get(url, {
            headers: store.headers,
            params: {
                per_page: 40,
            },
        });
        const orders = res.data || []; //pobieramy liste wszystkich zamówien
        const processingOrInTransitOrders = orders.filter(order => order.status === "processing" || order.status === "in-transit"); // filtrujemy zamowienia pod kątem statusów
        let ordersWithPackageNumber = []

        console.log('ORDERY DO SPRAWDZENIA', orders)

        processingOrInTransitOrders.forEach(order => { //jesli jest wygenerowana etykieta to dodaje nam pojedyncze zamowienie do tablicy wczesniej przygotowanej
            const trackingInfo = order.meta_data.find(item => item.key === 'tracking_info');

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

  //nazwa do zmiany
  @Cron(CronExpression.EVERY_2_HOURS)
  async getAllOrdersAndCheckStatusAndChangeIt(user_uuid: any) {
    try {

        const store = await this.getStoreByUserId(user_uuid)
      const orders = await this.getOrdersInTransitOrProcessingWithPackageNumber(store);
      let ordersWithDeliveredStatus = [];
      let ordersWithSendStatus = [];
  

  
      for (const order of orders) {
        try {
          const url = `${process.env.STORE_URL}/wp-json/wc/v3/orders/${order.id}`;
          const tracking_number = await getTrackingNumberFromOrder(order);
          const shipping = await this.furgonetkaService.getPackage(tracking_number, store.furgonetka_access_token);
          const isOrderExist = await OrderEntity.findOneBy({ order_id: order.id });
  
          if (!isOrderExist) {
            const newOrder = new OrderEntity();
            newOrder.order_id = order.id;
            newOrder.tracking_number = tracking_number;
            newOrder.state_description = order.status;
            await newOrder.save();
          }
  
          if (shipping.parcels[0].state === 'collected' || shipping.parcels[0].state === 'transit') {
            const checkOrder = await OrderEntity.findOneBy({ order_id: order.id });
            if (!checkOrder.notification_was_send) {
              await this.mailerService.sendMail({
                to: `${order.billing.email}`,
                subject: 'Zamówienie z bigsewciu.shop zostało wysłane!',
                text: 'Zlokalizuj swoją przesyłkę',
                html: mailTemplate(shipping.parcels[0].tracking_url, order),
              });
              checkOrder.notification_was_send = true;
              await checkOrder.save();
            }
            await updateStatus(url, 'in-transit');
            ordersWithSendStatus.push(order);
          } else if (shipping.parcels[0].state === 'delivered') {
            await updateStatus(url, 'completed');
            ordersWithDeliveredStatus.push(order);
          }
        } catch (orderError) {
          console.error(`Error processing order ${order.id}:`, orderError);
        }
      }
  
      const response = {
        inTransit: ordersWithSendStatus,
        delivered: ordersWithDeliveredStatus,
      };
  
      return response;
    } catch (error) {
      console.error('Error in getAllOrdersAndCheckStatusAndChangeIt:', error);
      throw new HttpException(
        {
          message: 'Wystąpił błąd podczas przetwarzania zamówień.',
          isSuccess: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}