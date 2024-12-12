import axios from "axios";
import {createAuthHeadersFromStoreCredentials} from "./createAuthHeadersFromStoreCredentials";

export const updateStatus = async (url, status) => {

    const storeHeaders = createAuthHeadersFromStoreCredentials(
        process.env.STORE_CONSUMER_KEY,
        process.env.STORE_CONSUMER_SECRET,
    );
        try {
            const data = {
                status
            };
            const res = await axios.put(url, data, { headers: storeHeaders });
        } catch (e) {
            throw e;
        }

}