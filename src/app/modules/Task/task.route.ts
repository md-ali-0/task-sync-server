import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TaskController } from "./task.controller";
import { taskValidation } from "./task.validation";

const router = Router();

router.get("/", auth(Role.USER, Role.ADMIN), TaskController.getAll);
router.get(
    "/statistics",
    auth(Role.USER, Role.ADMIN),
    TaskController.taskStatistics
);
router.get("/:id", auth(Role.USER, Role.ADMIN), TaskController.getOne);
router.post(
    "/",
    validateRequest(taskValidation.createTask),
    auth(Role.USER, Role.ADMIN),
    TaskController.create
);
router.put(
    "/:id",
    auth(Role.USER, Role.ADMIN),
    TaskController.update
);
router.delete("/:id", auth(Role.USER, Role.ADMIN), TaskController.remove);

export const TaskRoutes = router;
