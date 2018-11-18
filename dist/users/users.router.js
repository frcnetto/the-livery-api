"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.usersNode = '/users';
        this.usersIdNode = this.usersNode + '/:id';
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get(this.usersNode, this.findAll);
        application.get(this.usersIdNode, [this.validateId, this.findById]);
        application.post(this.usersNode, this.save);
        application.put(this.usersIdNode, [this.validateId, this.replace]);
        application.patch(this.usersIdNode, [this.validateId, this.update]);
        application.del(this.usersIdNode, [this.validateId, this.delete]);
    }
}
exports.usersRouter = new UsersRouter();
