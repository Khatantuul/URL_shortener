import app from '../app.js';
import urlRouter from './url-routes.js';
import subRouter from './sub-routes.js';


const route = (app) =>{
    app.use("/",urlRouter);
    app.use("/subscribe",subRouter);
}

export default route;