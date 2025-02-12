import { Role } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { upload } from "../../../config/multer.config";
import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";
const router = express.Router();

router.get(
    "/profile",
    auth(Role.ADMIN, Role.USER),
    AuthController.getMyProfile
);

router.put(
    "/profile",
    auth(Role.ADMIN, Role.USER),
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    AuthController.updateMyProfie
);

router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.signupUser);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

router.post("/change-password", AuthController.changePassword);

export const AuthRoutes = router;
