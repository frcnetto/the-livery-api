"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    envelope(document) {
        return document;
    }
    render(res, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(this.envelope(document));
            }
            else {
                throw new restify_errors_1.NotFoundError('Documento não encontrado.');
            }
            return next();
        };
    }
    renderAll(res, next) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                    //res.json( array[ index ] );
                });
                res.json(documents);
            }
            else {
                res.json([]);
            }
            return next();
        };
    }
}
exports.Router = Router;
