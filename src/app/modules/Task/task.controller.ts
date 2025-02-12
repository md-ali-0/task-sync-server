import { Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";

import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { TaskService } from "./task.service";

const create = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const result = await TaskService.create(user as IAuthUser, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Task data created!",
        data: result,
    });
});

const getAll: RequestHandler = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const filters = pick(req.query,  ['name', 'searchTerm']);
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const user = req.user
        console.log('user', user);
    
        
        const result = await TaskService.getAll(user as IAuthUser, filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Task data fetched!",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await TaskService.getOne(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Task data Created",
        data: result,
    });
});

const update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await TaskService.update(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Task data updated!",
        data: result,
    });
});

const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await TaskService.remove(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Task data deleted!",
        data: result,
    });
});

const taskStatistics = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const result = await TaskService.taskStatistics(user as IAuthUser);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Task data created!",
        data: result,
    });
});

export const TaskController = {
    create,
    getAll,
    getOne,
    update,
    remove,
    taskStatistics
};
