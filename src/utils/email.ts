import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { variables } from '../variables';

sgMail.setApiKey(variables.SENDGRID_API_KEY);

export const sendEmailAlert = async (subject: string, text: string) => {
  if (variables.EMAIL_ALERTS_ON !== 'TRUE') return;

  const msg: MailDataRequired = {
    to: variables.EMAIL_ALERTS_RECIPIENT,
    from: variables.EMAIL_ALERTS_SENDER,
    subject,
    text,
  };

  try {
    const response = await sgMail.send(msg);
    console.info('Send email alert:', response);
  } catch (err) {
    console.error('Failed to send email', err);
  }
};
