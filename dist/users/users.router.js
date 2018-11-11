"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
class UsersRouter extends router_1.Router {
    constructor() {
        super(...arguments);
        this.usersNode = '/users';
        this.usersIdNode = this.usersNode + '/:id';
    }
    applyRoutes(application) {
        application.get(this.usersNode, (req, res, next) => {
            users_model_1.User.find().then(users => {
                res.json(users);
                return next;
            });
        });
        application.get(this.usersIdNode, (req, res, next) => {
            users_model_1.User.findById(req.params.id).then(user => {
                if (user) {
                    res.json(user);
                    return next();
                }
                res.send(404);
                return next();
            });
        });
        application.post(this.usersNode, (req, res, next) => {
            let user = new users_model_1.User(req.body);
            user.save().then(user => {
                user.password = '*';
                res.json(user);
                return next();
            });
        });
        application.put(this.usersIdNode, (req, res, next) => {
            const options = { overwrite: true };
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(result => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    res.send(404);
                }
            })
                .then(user => {
                res.json(user);
                return next();
            });
        });
        application.patch(this.usersIdNode, (req, res, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                if (user)
                    res.json(user);
                else
                    res.send(404);
                return next();
            });
        });
    }
}
exports.usersRouter = new UsersRouter();