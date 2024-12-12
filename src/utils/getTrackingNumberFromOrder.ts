import { createResponse } from './createResponse';

export const getTrackingNumberFromOrder = async (
  order: any,
): Promise<string | null> => {
  try {
    const trackingInfo = order.meta_data.find(
      (meta: any) => meta.key === 'tracking_info',
    ).value;
    const tracking_number = Object.keys(trackingInfo)[0];
    if (!tracking_number) {
      createResponse(
        false,
        `Zamówienie nr ${order.id} nie posiada jeszcze wygenerowanego kodu przesyłki`,
        404,
      );
    }
    return tracking_number;
  } catch (e) {
    return null;
  }
};
