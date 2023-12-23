import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: 'riyazulhaque64@gmail.com',
      pass: 'ndpy kyno lpsw bfni',
    },
  });

  await transporter.sendMail({
    from: 'riyazulhaque64@gmail.com',
    to,
    subject: 'Reset your password within 10 minutes',
    text: 'Please, reset your password within 10 minutes',
    html,
  });
};

export default sendEmail;
