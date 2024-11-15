export const happyNewYearTemplate = (userName) => {
    return `
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Nunito', Helvetica, Arial, sans-serif;">
        <tr>
          <td style="background-color: #007AFF; color: #fff; padding: 40px; border-radius: 12px 12px 0 0;">
            <h1 style="font-size: 25px; font-weight: 700; margin: 0;">Happy New Year, ${userName}!</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F5F5F5; padding: 40px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 14px; color: #333; margin-bottom: 24px;">We hope the new year brings you joy, success, and plenty of opportunities to grow.</p>
            <p style="font-size: 14px; color: #333; margin-bottom: 24px;">May this year be your best yet. We're here to support you every step of the way.</p>
            <p style="font-size: 14px; color: #888; margin-top: 24px;">Best regards,<br>The Daily Checkin Team</p>
          </td>
        </tr>
      </table>
    `;
  };



  export const happyNewMonthTemplate = (userName) => {
    return `
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Nunito', Helvetica, Arial, sans-serif;">
        <tr>
          <td style="background-color: #007AFF; color: #fff; padding: 40px; border-radius: 12px 12px 0 0;">
            <h1 style="font-size: 25px; font-weight: 700; margin: 0;">Happy New Month, ${userName}!</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F5F5F5; padding: 40px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 14px; color: #333; margin-bottom: 24px;">We hope you're ready to tackle the new month ahead. Remember, consistency is key to reaching your goals.</p>
            <p style="font-size: 14px; color: #333; margin-bottom: 24px;">Keep up the great work, and let us know if there's anything we can do to support you.</p>
            <p style="font-size: 14px; color: #888; margin-top: 24px;">Best regards,<br>The Daily Checkin Team</p>
          </td>
        </tr>
      </table>
    `;
  };


  export const streakEndReminderTemplate = (userName, checkInUrl) => {
    return `
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Nunito', Helvetica, Arial, sans-serif;">
        <tr>
          <td style="background-color: #007AFF; color: #fff; padding: 40px; border-radius: 12px 12px 0 0;">
            <h1 style="font-size: 25px; font-weight: 700; margin: 0;">Hi ${userName},</h1>
            <p style="font-size: 18px; font-weight: 400; margin-top: 12px;">We noticed that your last check-in was more than 24 hours ago, so your streak is about to end.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F5F5F5; padding: 40px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">Don't worry, it's easy to get back on track. Click the button below to check in now:</p>
            <a href="${checkInUrl}" style="display: inline-block; background-color: #007AFF; color: #fff; padding: 16px 24px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">Check-In Now</a>
            <p style="font-size: 14px; color: #888; margin-top: 24px;">If you need help or have any questions, don't hesitate to reach out to us.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #EEEEEE; text-align: center; padding: 20px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 14px; color: #888;">Best regards,<br>The Daily Checkin Team</p>
          </td>
        </tr>
      </table>
    `;
  };