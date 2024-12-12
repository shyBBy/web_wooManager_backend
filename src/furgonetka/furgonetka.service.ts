import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {StoreEntity} from "../store/entities/store.entity";

@Injectable()
export class FurgonetkaService {
    public async getPackage(
        trackingNumber: string,
        furgonetka_access_token: string,
    ) {
        const url = 'https://api.furgonetka.pl/packages';
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${furgonetka_access_token}`,
                },
            });

            const packages = res.data.packages;
            try {
                const foundPackage = packages.find(
                    (onePackage) => onePackage.parcels[0].package_no === trackingNumber,
                );
                return foundPackage;
            } catch (e) {
                return null;
            }
        } catch (e) {
            console.log('W FURGONETKA SERVICE', e);
            throw e;
        }
    }

    public async getShippingStatus(
        package_id: string,
        furgonetka_access_token: string,
    ) {
        const url = `https://api.furgonetka.pl/packages/${package_id}/tracking`;
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${furgonetka_access_token}`,
                },
            });
            const shipping = res.data;
            return shipping;
        } catch (e) {
            return null;
        }
    }

    // public async downloadShippingLabel(package_id: any) {
    //     const url = `https://api.furgonetka.pl/packages/${package_id}/label`;
    //     try {
    //         const store_url = process.env.WOOCOMMERCE_STORE_URL
    //         const store = await StoreEntity.findOneBy({url: store_url})
    //         const res = await axios.get(url, {
    //             headers: {
    //                 Authorization: `Bearer ${store.furgonetka_access_token}`
    //             }
    //         })
    //         console.log(`RESPONSE`, res)
    //         const label = res.data;
    //         return label;
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}
