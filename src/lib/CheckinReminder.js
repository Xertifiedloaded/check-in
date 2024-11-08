export const reminderTemplate = (userName, websiteUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Nunito', Helvetica, Arial, sans-serif;">
        <tr>
          <td style="background-color: #007AFF; color: #fff; padding: 40px; border-radius: 12px 12px 0 0;">
            <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Hi ${userName},</h1>
            <p style="font-size: 15px; font-weight: 400; margin-top: 12px;">Here's a friendly reminder to check in today.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F5F5F5; padding: 20px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">It's easy to stay on top of your goals. Click the button below to check in now:</p>
            <a href="${websiteUrl}" style="display: inline-block; background-color: #007AFF; color: #fff; padding: 16px 24px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">Check-In Now</a>
            <p style="font-size: 14px; color: #888; margin-top: 24px;">If you need help or have any questions, don't hesitate to reach out to us.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #EEEEEE; text-align: center; padding: 20px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 14px; color: #888;">Best regards,<br>Your Team at DailyCheckin</p>
            <p style="font-size: 12px; color: #aaa;">You're receiving this email because you signed up with us.</p>
          </td>
        </tr>
        </table>
    </body>
    </html>
    `;
  };