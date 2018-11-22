"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./common/router");
class IndexRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/', (req, resp, next) => {
            resp.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews'
            });
        });
    }
}
exports.indexRouter = new IndexRouter();
