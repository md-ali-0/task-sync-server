import { Role, User, UserStatus } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import emailSender from "./emailSender";

const generateTokens = (user: { id: string; role: Role }) => {
    const accessToken = jwtHelpers.generateToken(
        { user: user.id, role: user.role },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
        { user: user.id, role: user.role },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return { accessToken, refreshToken };
};

const loginUser = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "User not found or inactive!"
        );
    }
    if (user.status === UserStatus.BLOCKED) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User Suspended");
    }
    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect password!");
    }

    const tokens = generateTokens(user);

    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    };
};

const signupUser = async (payload: {
    name: string;
    email: string;
    password: string;
}) => {
    const { name, email, password } = payload;
    
    const hashedPassword =  await hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return newUser;
};

const refreshToken = async (token: string) => {
    let decodedToken;
    try {
        decodedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.refresh_token_secret as Secret
        );
    } catch (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!");
    }

    const user = await prisma.user.findUnique({
        where: { email: decodedToken.email },
    });

    if (!user) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "User not found or inactive!"
        );
    }

    const accessToken = jwtHelpers.generateToken(
        { email: user.email, role: user.role },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return { accessToken };
};

const changePassword = async (
    user: { email: string },
    payload: { oldPassword: string; newPassword: string }
) => {
    const { oldPassword, newPassword } = payload;

    const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
    });

    if (!existingUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const isCorrectPassword = await compare(
        oldPassword,
        existingUser.password
    );

    if (!isCorrectPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect old password!");
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
        where: { email: existingUser.email },
        data: { password: hashedPassword },
    });

    return { message: "Password changed successfully!" };
};

const forgotPassword = async (payload: { email: string }) => {
    const { email } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const resetToken = jwtHelpers.generateToken(
        { email: user.email, role: user.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    );

    const resetLink = `${config.reset_pass_link}?token=${resetToken}`;

    await emailSender(
        email,
        `<p>Dear User,</p>
         <p>Click the link below to reset your password:</p>
         <a href="${resetLink}">Reset Password</a>`
    );
};

const resetPassword = async (token: string, payload: { password: string }) => {
    let decodedToken;

    try {
        decodedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.reset_pass_secret as Secret
        );
    } catch (err) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Invalid or expired token!"
        );
    }
    console.log(payload);
    
    const hashedPassword = await hash(payload.password, 12);
    console.log(hashedPassword);
    
    await prisma.user.update({
        where: { email: decodedToken.email },
        data: { password: hashedPassword },
    });

    return { message: "Password reset successful!" };
};

const getMyProfile = async (user: IAuthUser) => {

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: user?.user,
        },
        select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            phone: true,
            role: true,
        },
    });

    return userInfo;
};

const updateMyProfie = async (
    user: IAuthUser,
    files: any,
    data: Partial<User>
) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: user?.user,
        },
    });

    const avatar = files?.avatar?.[0]?.path || "";
    if (avatar) {
        data.avatar = avatar;
    }
    if (data.password) {
        data.password = await hash(data.password, 10);
    }

    const profileInfo = await prisma.user.update({
        where: {
            email: userInfo.email,
        },
        data: data,
    });
    return profileInfo;
};


export const AuthServices = {
    loginUser,
    signupUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    getMyProfile,
    updateMyProfie
};
