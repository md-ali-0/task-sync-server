import { z } from "zod";

const createTask = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required!",
        }),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"], {
            required_error: "Status is required!",
        }),
        date: z
            .string({
                required_error: "Date is required!",
            })
            .transform((val) => new Date(val)),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
            required_error: "Priority is required!",
        })
    }),
});

export const taskValidation = {
    createTask,
};
