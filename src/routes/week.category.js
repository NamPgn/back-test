import express from 'express';
import { all, create, del, edit, one } from '../controller/week.categoty';

const routerWeek = express.Router();

routerWeek.get('/weeks', all);
routerWeek.get('/week/:id', one);
routerWeek.post('/week', create);
routerWeek.delete('/week/:id', del);
routerWeek.put('/week/:id', edit);

export default routerWeek;