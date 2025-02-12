import { Prisma, Task } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const create = async (user: IAuthUser, payload: Task) => {
    const data = { ...payload, userId: user.user };
    const result = await prisma.task.create({
        data,
    });

    return result;
};

const getAll = async (
    user: IAuthUser,
    params: Record<string, unknown>,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.TaskWhereInput[] = [];
    if (user.role === "USER") {
        andCondions.push({
            userId: user.user,
        });
    }

    if (params.searchTerm) {
        andCondions.push({
            OR: ["name"].map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons: Prisma.TaskWhereInput = { AND: andCondions };

    const result = await prisma.task.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? {
                      [options?.sortBy]: options.sortOrder,
                  }
                : {
                      createdAt: "desc",
                  },
    });

    const total = await prisma.task.count({
        where: whereConditons,
    });

    const totalPage = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: result,
    };
};

const getOne = async (id: string): Promise<Task | null> => {
    const result = await prisma.task.findUnique({
        where: {
            id,
        },
    });

    return result;
};

const update = async (id: string, data: Partial<Task>): Promise<Task> => {
    await prisma.task.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma.task.update({
        where: {
            id,
        },
        data,
    });

    return result;
};

const remove = async (id: string): Promise<Task | null> => {
    await prisma.task.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.task.delete({
        where: {
            id,
        },
    });

    return result;
};

const getMonthName = (month: number) => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[month] || "Unknown";
};

const taskStatistics = async (user: IAuthUser) => {
    let query: { userId?: string } = {};

    if (user.role === "USER") {
        query.userId = user.user;
    }

    const totalTasks = await prisma.task.count({ where: query });
    const totalTasksCompleted = await prisma.task.count({
        where: { ...query, status: "DONE" },
    });
    const totalTasksInProgress = await prisma.task.count({
        where: { ...query, status: "IN_PROGRESS" },
    });

    const tasks = await prisma.task.findMany({
        where: query,
        select: {
            date: true,
        },
    });

    const groupedData = tasks.reduce((acc, task) => {
        const monthIndex = new Date(task.date).getMonth();
        const monthName = getMonthName(monthIndex);

        if (!acc[monthName]) {
            acc[monthName] = 0;
        }
        acc[monthName] += 1;

        return acc;
    }, {} as Record<string, number>);

    const formattedData = Object.entries(groupedData).map(([name, total]) => ({
        name,
        total,
    }));

    return { 
        total: {
            totalTasks,
            totalTasksCompleted,
            totalTasksInProgress,
        }, 
        formattedData 
    };
};

export const TaskService = {
    create,
    getAll,
    getOne,
    update,
    remove,
    taskStatistics,
};
