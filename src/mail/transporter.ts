import { createTransport } from 'nodemailer'
import {appConfig} from "../config";


export const transporter = createTransport(appConfig.mail.transporter)
