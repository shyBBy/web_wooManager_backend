import * as crypto from 'crypto';

export const hashPwd = (password: string): string => {
  const hmac = crypto.createHmac(
    'sha512',
    '98dsa9dsa dsahudsa hush yweuh217u3y 8 dsaujh xczbjnxz0hbcxh0sdgsay dhg SDAUYHD S*A&C XZB HBSDBySADG7asy 7- gsda BDYG SAYGCXZ CHBVSA HDGBSAUYhSA Udhas UASYHD *AS& &*AS YDASUYH GDHBCXZH BCXHDGSAYUDsa &^AgYAS GAYCGaYCXZG YSDG A',
  );
  hmac.update(password);
  return hmac.digest('hex');
};

// POD IPB
// export class PasswordUtils {
//     static async checkPassword(
//         passwordToCheck: string,
//         passwordFromDb: string,
//     ): Promise<boolean> {
//         return await new Promise<boolean>((resolve, reject) =>
//             bcrypt.compare(
//                 passwordToCheck,
//                 passwordFromDb.replace(/^\$2y/, '$2b'),
//                 (err: Error, same: boolean) => {
//                     if (err) {
//                         reject(err);
//                     }
//
//                     resolve(same);
//                 },
//             ),
//         );
//     }
// }
