import {BadRequestException, forwardRef, Inject, Injectable,} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {Response} from 'express';
import {UserEntity} from '../user/entities/user.entity';
import {sign} from 'jsonwebtoken';
import {UserService} from '../user/user.service';
import {hashPwd} from '../utils/password.utils';
import axios from 'axios';
import {StoreService} from '../store/store.service';
import {createResponse} from "../utils/createResponse";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private storeService: StoreService,
        private dataSource: DataSource,
    ) {
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.getByEmail(email);
        if (user && user.password === hashPwd(password)) {
            return user;
        }
        throw new BadRequestException('Błędny login lub hasło.');
    }

    async login(user: UserEntity, res: Response) {


        const payload = {email: user.email};
        const token = sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});
        const oneDay = 1000 * 60 * 60 * 24;
        if (!user.isActive) {
            throw new BadRequestException(
                'Twoje konto jest nieaktywne, sprawdź proszę skrzynkę pocztową.',
            );
        }

        const userRes = await this.userService.getMe(user);
        return res
            .cookie('jwt', token, {
                secure: Boolean(process.env.JWT_COOKIE_SECURE),
                domain: process.env.JWT_COOKIE_DOMAIN,
                httpOnly: Boolean(process.env.JWT_HTTP_ONLY),
                maxAge: oneDay,
            })
            .json(userRes);
    }

    // async wpLogin(
    //     wpLoginDto: WpLoginDto,
    //     user: any,
    //     res: Response,
    // ): Promise<any> {
    //     try {
    //         const {username, password} = wpLoginDto;
    //         const store = await this.storeService.getStoreByUserId(user.id);
    //         const url = `${store.store_url}/wp-json/jwt-auth/v1/token`;
    //         const response = await axios.post(url, {
    //             username,
    //             password,
    //         });

    //         // Odbierz token z odpowiedzi
    //         const token = response.data.token;

    //         // Zapisz token w encji użytkownika (przykład, dostosuj do Twojej struktury)
    //         const userEntity = await this.userService.getByEmail(user.email);
    //         userEntity.wpTokenAuth = token;
    //         await userEntity.save();

    //         // Tutaj dostosuj odpowiedź do Twoich potrzeb
    //         const wpLoginRes = {
    //             token,
    //         };

    //         // Tutaj możesz dostosować res.cookie do Twoich potrzeb
    //         return res
    //             .cookie('wpLoginToken', wpLoginRes.token, {
    //                 secure: Boolean(process.env.WPLOGINTOKEN_COOKIE_SECURE),
    //                 domain: process.env.JWT_COOKIE_DOMAIN,
    //                 httpOnly: Boolean(process.env.JWT_HTTP_ONLY),
    //                 maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni w milisekundach
    //             })
    //             .json(wpLoginRes);
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error('Nie udało się zalogować do WordPress.');
    //     }
    // }


    // async checkWpToken(user) {
    //     try {
    //         const store = await this.storeService.getStoreByUserId(user.id);
    //         const url = `${store.store_url}/wp-json/jwt-auth/v1/token/validate`;
    //         const storedUser = await this.userService.getByEmail(user.email)
    //         if (!storedUser || !storedUser.wpTokenAuth) {
    //             console.log(`1`, storedUser.wpTokenAuth)
    //             return createResponse(false, `Brak przypisanego wpToken`, 401, null);
    //         }


    //         const response = await axios.post(url, null, {
    //             headers: {
    //                 Authorization: `Bearer ${storedUser.wpTokenAuth}`,
    //             },
    //         });

    //         if (response.status === 200) {
    //             const result = response.data;
    //             console.log(`2`, storedUser.wpTokenAuth)

    //             // Sprawdzamy, czy kod odpowiedzi to "jwt_auth_valid_token"
    //             if (result.code === "jwt_auth_valid_token") {
    //                 console.log(`3`, storedUser.wpTokenAuth)
    //                 return createResponse(true, `Token poprawny`, 200, `true`)
    //             } else {
    //                 console.log(`4`, storedUser.wpTokenAuth)
    //                 return createResponse(false, `Token niepoprawny`, 401, null)
    //             }
    //         } else {
    //             console.log(`5`, storedUser.wpTokenAuth)
    //             return createResponse(false, `Coś poszło nie tak`, 405, null)
    //         }
    //     } catch (error) {
    //         console.log('6')
    //         return createResponse(false, `Coś poszło nie tak podczas sprawdzania tokenu.`, 500, null)
    //     }
    // }

    logout(res: Response, responseObj?: { statusCode: number; message: string }) {
        const resObj = responseObj ?? {message: 'Logout was successful'};
        return res
            .clearCookie('jwt', {
                secure: Boolean(process.env.JWT_COOKIE_SECURE),
                domain: process.env.JWT_COOKIE_DOMAIN,
                httpOnly: Boolean(process.env.JWT_HTTP_ONLY),
            })
            .json(resObj);
    }
}
