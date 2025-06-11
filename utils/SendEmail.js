import nodemailer from 'nodemailer';

export const sendEmail = async (email, otp) =>{
    console.log("Send Email start :-",email)
    const auth = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const receiver = {
        to: email,
        subject: 'Forget Password',
        html: htmlBody(otp),
        from: 'no-reply-abc',
    };
    return new Promise((resolve, reject) => {
        auth.sendMail(receiver, (err, info) => {
            if (err) {
                reject(err);
            } else {
                console.log("Send Email end :-",email)

                resolve(true);
            }
        }); 
    });
}


const htmlBody = (otp, ) => {
    return `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                        max-width: 600px;
                        margin: auto;
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                    }
                    p {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.5;
                    }
                    .otp {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                        text-align: center;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Forget Password</h1>
                    <p>We received a request to reset your password. Your One-Time Password (OTP) is:</p>
                    <div class="otp">${otp}</div>
                    <p>Please enter this OTP to proceed with resetting your password.</p>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <div class="footer">
                        &copy; ${new Date().getFullYear()} ${process.env.BRAND_NAME}. All rights reserved.
                    </div>
                </div>
            </body>
        </html>
    `;
};
