import {OrderProfileInterface} from "../../types/order/order";

export const mailTemplate = (tracking_url: any, order: OrderProfileInterface) => {

  const deliveryDate: Date = new Date(order.date_created);
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDeliveryDate: string = deliveryDate.toLocaleDateString('pl-PL');


  const template = `
        <html>
           <head>
                <meta charset="UTF-8" />
                <title>Śledź paczke!</title>
            </head>
          <body>
            <div>
                <p>
              <strong>Witaj, ${order.billing.first_name} </strong>
            </p>
            <p>Dziękujemy za złożenie zamówienia w naszym sklepie. Cieszymy się, że wybrałeś właśnie nasz sklep z odzieżą roboczą. Informujemy Cię, że Twoje zamówiene właśnie zostało wysłane i poniżej znajdują się wszelkie informacje potrzebne do śledzenia paczki. .
            
            <p><strong>Status zamówienia: </strong>Zamówienie wysłane.</p>
            <p><strong>Numer zamówienia: </strong>${order.id}</p>
            <p><strong>Data zamówienia: </strong>${new Date(order.date_created).toLocaleDateString('pl-PL')}</p>
            <p><strong>Przewidywana data dostawy: </strong>${formattedDeliveryDate}</p>
            <br>
            <p>Aby śledzić status Twojej przesyłki, prosimy kliknąć na poniższy link:</p>
            <br>
            <p><strong>${tracking_url}</strong></p>
            <p>Jeśli masz jakiekolwiek pytania lub potrzebujesz dodatkowych informacji, skontaktuj się z naszym zespołem obsługi klienta. <a href="mailto:bigsewciushop@gmail.com">Wyślij e-mail.</a></p>
            <p>Dziękujemy jeszcze raz za skorzystanie z naszych usług i zapraszamy ponownie.</p>
            <p>Zespół Obsługi Klienta BIGSEWCIU.SHOP</p>
            </div>
          </body>
        </html>
    `;
  return template;
};
