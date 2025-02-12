import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { TaskRoutes } from '../modules/Task/task.route';
import { userRoutes } from '../modules/User/user.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/users',
        route: userRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/tasks',
        route: TaskRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;