
require('dotenv').config();

import { Message, SMTPClient } from 'emailjs';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { EmailCsv } from "./interfaces/Email";
import './server';
import { csvToArray } from "./utils";

const readFile = promisify(fs.readFile);

const client = new SMTPClient({
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASS,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  tls: true
});

const sendMail = async (email: EmailCsv) => {
  try {
    const filePath = path.join(__dirname, 'templates', email.template);

    let template = await readFile(filePath, 'utf-8');

    if (!template)
      return;

    const regEmail = new RegExp(/%email%/g);
    const regRef = new RegExp(/%ref%/g);

    template =
      template
        .replace(regEmail, email.usuario)
        .replace(regRef, `${process.env.SERVER_HOST}?email=${email.usuario}`)

    let msg = new Message({
      from: `${email.fromName} <${email.from}>`,
      to: `Você <${email.usuario}>`,
      subject: email.titulo,
      attachment: [
        { data: template, alternative: true }
      ]
    });

    await client.sendAsync(msg);

    console.log(`sent to ${email.usuario}`);

  } catch (err) {
    console.error(err);
  }
}

const main = async () => {

  const filePath = path.join(__dirname, 'emails', 'emails.csv');

  const emailCsv = await readFile(filePath, 'utf-8');

  const emails = await csvToArray<EmailCsv>(emailCsv);

  for (const email of emails) {
    await sendMail(email);
  }
}

main();


