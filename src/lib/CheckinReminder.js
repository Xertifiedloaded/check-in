export const reminderTemplate = (userName, websiteUrl) => {
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #f9f9f9; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="font-size: 24px; margin: 0;">Hello ${userName}!</h2>
          <p style="font-size: 16px; margin-top: 10px;">We hope you're doing well! This is a friendly reminder to check in today.</p>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #ddd; margin-top: 20px;">
          <p style="font-size: 16px; color: #333;">It's easy to stay on top of your goals. Click below to check in now:</p>
          <a href="${websiteUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 15px;">Check-In Now</a>
          <p style="font-size: 14px; color: #888; margin-top: 20px;">If you need help or have any questions, don't hesitate to contact us.</p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 10px; margin-top: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 14px; color: #888;">Best regards,<br/>Your Team at DailyCheckin</p>
          <p style="font-size: 12px; color: #aaa;">You are receiving this email because you signed up with us.</p>
        </div>
      </div>
    `;
  };
  