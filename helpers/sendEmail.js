import nodemailer from 'nodemailer'
import dotent from 'dotenv/config'

const { UKR_NET_PASS, UKR_NET_MAIL } = process.env;

const nodenmailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_MAIL,
        pass: UKR_NET_PASS       
    },
}

const transport = nodemailer.createTransport(nodenmailerConfig);

// const email = {
//     from: UKR_NET_MAIL,
//     to: "",
//     subject: "test",
//     text: "Hello world!"
// }


const sendEmail = (data) => {
    const email = {...data, from: UKR_NET_MAIL}
    return transport.sendMail(email)
}

export default sendEmail