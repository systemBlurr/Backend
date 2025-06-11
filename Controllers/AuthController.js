import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authModel from "../Models/AuthModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";
import { sendEmail } from "../utils/SendEmail.js";
import { singleFileUploader } from "../service/singleUploader.js";


const authController = {};

authController.updateUser = async (req, res, next) => {
    try {
        const upload = singleFileUploader(
            process.env.USER_IMAGE,
            `user`,
            "profile",
            1024 * 1024 * 10
        );

        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'File upload failed', error: err });
            }

            const { name, mobile, email } = req.body;
            const error = validationService.validateRequired({ name, mobile, email }, ['name', 'mobile', 'email']);
            if (error) {
                return res.send(getErrorObject(400, 'Bad request', error));
            }

            let fileName;
            if (typeof req.body.profile === 'string') {
                fileName = req.body.profile;
            } else {
                fileName = "/" + process.env.USER_IMAGE.split('/').pop() + '/' + req.file?.filename
            }

            const reqBody = {
                name: name,
                email: email,
                mobile: mobile,
                profile: fileName || '',
                id: req.params.id
            };
            const result = await authModel.updateUser(reqBody);
            return res.send(getUserSuccessResponse(result));
        });
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};
authController.updatePassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword } = req.body
        const error = validationService.validateRequired({ currentPassword, newPassword }, ['currentPassword', 'newPassword']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const user = await authModel.getUserById(req.params.id);
        if (!user) {
            return res.send(getErrorObject(404, 'User not found'));
        }
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            return res.send(getErrorObject(401, 'Current Password is incorrect'));
        }
        const reqBody = {
            id: req.params.id,
            password: await bcrypt.hash(req.body.newPassword, 10)
        }
        await authModel.updatePassword(reqBody);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in updatePassword", err));
    }
};

const getUserSuccessResponse = (user) => {
    if (!user) {
        return getErrorObject(404, 'User not found');
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return getSuccessObject({
        isLoggedIn: true,
        token,
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        department: user.department,
        status: user.status,
        profile: user.profile
    });
}


authController.login = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['email', 'password']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const user = await authModel.getUserByEmail(req.body.email);
        if (!user) {
            return res.send(getErrorObject(404, 'User not found'));
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.send(getErrorObject(401, 'Invalid credentials'));
        }
        return res.send(getUserSuccessResponse(user));

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}
authController.sendOtp = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['email']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const user = await authModel.getUserByEmail(req.body.email);
        if (!user.length) {
            return res.send(getErrorObject(404, 'User not found'));
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const send = await sendEmail(req.body.email, otp);
        if (send == true) {
            const reqObj = {
                id: user[0].id,
                email: user[0].email,
                otp: otp,
                status: 0,
                contact: user[0].email,
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            }
            await authModel.sendOtp(reqObj);
            return res.send(getSuccessObject("OTP sent successfully"));
        }

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}
authController.verifyOtp = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['email', 'otp']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const verifyCode = await authModel.getOtpEmail(req.body.email);
        if (!verifyCode) {
            return res.send(getErrorObject(404, 'Otp not found!'));
        }
        if (verifyCode.otp === req.body.otp) {
            await authModel.verifyCode({ id: verifyCode.id, userId: verifyCode.userId, status: 1 });
            return res.send(getSuccessObject('Otp verified successfully'));
        }
        return res.send(getErrorObject(401, 'Invalid Otp'));
    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

authController.getUsers = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await authModel.getUsers(req.params.id);
        return res.send(getSuccessObject(result));

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}

export default authController;