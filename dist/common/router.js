"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Router extends events_1.EventEmitter {
    render(res, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(document);
            }
            else {
                res.send(404);
            }
            return next();
        };
    }
}
exports.Router = Router;
