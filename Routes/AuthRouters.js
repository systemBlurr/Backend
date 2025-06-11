import express from 'express';
import middleware from '../Middlewares/AuthValidation.js';
import authController from '../Controllers/AuthController.js';
const router = express.Router();

router.post('/login', middleware.loginValidation, authController.login);
router.post('/update/:id', authController.updateUser)
router.post('/send-otp', middleware.otpValidation, authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp);
router.get('/user/:id', authController.getUsers);
router.post('/password/:id', authController.updatePassword);

export default router

