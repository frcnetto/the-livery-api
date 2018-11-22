"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurant_router_1 = require("./restaurants/restaurant.router");
const reviews_router_1 = require("./reviews/reviews.router");
const index_router_1 = require("./index.router");
const server = new server_1.Server();
server.bootstrap([index_router_1.indexRouter, users_router_1.usersRouter, restaurant_router_1.restaurantsRouter, reviews_router_1.reviewsRouter]).then(server => {
    console.log('Listening on:', server.application.address());
}).catch(error => {
    console.log('Server failed to start!');
    console.error(error);
    process.exit(1);
});
