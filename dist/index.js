"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurant_router_1 = require("./restaurants/restaurant.router");
const server = new server_1.Server();
server.bootstrap([users_router_1.usersRouter, restaurant_router_1.restaurantsRouter]).then(server => {
    console.log('Listening on:', server.application.address());
}).catch(error => {
    console.log('Server failed to start!');
    console.error(error);
    process.exit(1);
});
