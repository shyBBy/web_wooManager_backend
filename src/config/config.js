"use strict";
exports.__esModule = true;
exports.config = void 0;
exports.config = {
    jwtTimeToExpire: '0s',
    jwtCookieTimeToExpire: 0,
    // DOMENA
    jwtCookieDomain: 'localhost',
    // JESLI HTTPS to TRUE, A JAK HTTP to FALSE
    jwtCookieSecure: false,
    jwtHttpOnly: true,
    dbHost: 'localhost',
    dbPort: 3306,
    dbDatabase: 'fleetpro',
    dbUsername: 'fleetadminprodb',
    dbPassword: 'CSJN_[uKM)YciJgw',
    dbSynchronize: true,
    dbLogging: true,
    frontendDomain: 'http://localhost:3000'
};
