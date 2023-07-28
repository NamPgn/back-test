import express from 'express';
import { all, create, del, edit, one } from '../controller/week.categoty';
import { requiredSignin, isAuth, checkToken } from "../middlewares/checkAuth";
const routerWeek = express.Router();

routerWeek.get('/weeks', all);
routerWeek.get('/week/:id', one);
routerWeek.post('/week', requiredSignin, isAuth, checkToken, create);
routerWeek.delete('/week/:id', requiredSignin, isAuth, checkToken, del);
routerWeek.put('/week/:id', requiredSignin, isAuth, checkToken, edit);

export default routerWeek;