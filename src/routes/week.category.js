import express from 'express';
import { all, create, del, edit, one } from '../controller/week.categoty';
import { requiredSignin, isAuth, checkToken } from "../middlewares/checkAuth";
import { getAuth } from '../controller/auth';
const routerWeek = express.Router();

routerWeek.get('/weeks', all);
routerWeek.get('/week/:id', one);
routerWeek.post('/week/:userId', requiredSignin, isAuth, checkToken, create);
routerWeek.delete('/week/:id/:userId', requiredSignin, isAuth, checkToken, del);
routerWeek.put('/week/:id/:userId', requiredSignin, isAuth, checkToken, edit);
router.param('userId', getAuth);
export default routerWeek;