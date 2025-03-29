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
                sameSite: 'none',
                maxAge: oneDay,
            })
            .json(userRes);
    }

//     return res
//   .cookie('jwt', token, {
//     secure: true, // SSL wymagane
//     domain: '.bigsewciu.shop', // Obsługa subdomen
//     httpOnly: true,
//     sameSite: 'None', // <--- MUSI BYĆ "None" dla ciastek między subdomenami
//     maxAge: oneDay,
//   })
//   .json(userRes);


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
