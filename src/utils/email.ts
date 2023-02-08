import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { variables } from '../variables';

sgMail.setApiKey(variables.SENDGRID_API_KEY || '');

export const sendEmailAlert = async (subject: string, text: string) => {
  if (variables.EMAIL_ALERTS_ON !== 'TRUE') return;

  const to = variables.EMAIL_ALERTS_RECIPIENT;
  const from = variables.EMAIL_ALERTS_SENDER || '';
  const msg: MailDataRequired = {
    to,
    from,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.info(
      `Email sent to "${to}" from "${from}" with subject "${subject}" and text "${text}"`
    );
  } catch (err) {
    console.error('Failed to send email', err);
  }
};
