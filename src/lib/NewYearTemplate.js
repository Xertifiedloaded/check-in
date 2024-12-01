export const happyNewYearTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Happy New Year - Daily Checkin</title>
      <style>
        body { font-family: 'Nunito', Arial, sans-serif; line-height: 1.6; }
      </style>
    </head>
    <body>
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Nunito', Helvetica, Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="background-color: #007AFF; color: #fff; padding: 30px; text-align: center;">
            <img src="cid:newYearBanner" alt="Daily Checkin New Year Banner" style="max-width: 200px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
            <h1 style="font-size: 28px; font-weight: 700; margin: 0;">Welcome to a New Year, ${userName}!</h1>
            <p style="font-size: 16px; margin-top: 10px;">2024: Your Year of Transformation</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #FFFFFF; padding: 40px; line-height: 1.6;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">As we step into 2024, we're filled with excitement for the incredible potential that lies ahead. Your dedication and commitment throughout the past year have been nothing short of inspiring.</p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">This new year is more than just a change in the calendar – it's an opportunity to reset, refocus, and recommit to your personal and professional goals. Every challenge is a chance to grow, and every small step brings you closer to your dreams.</p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">At Daily Checkin, we're committed to supporting your journey. Our platform is designed to help you track progress, stay motivated, and turn your aspirations into achievements.</p>
            
            <div style="background-color: #F5F5F5; border-left: 4px solid #007AFF; padding: 15px; margin-bottom: 20px;">
              <p style="font-size: 15px; color: #555; font-style: italic; margin: 0;">"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt</p>
            </div>
            
            <p style="font-size: 16px; color: #888; margin-top: 30px;">Warmest wishes for a remarkable year,<br>
            <strong>The Daily Checkin Team</strong></p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            © 2024 Daily Checkin. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};



  export const happyNewMonthTemplate = (userName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Happy New Month - Daily Checkin</title>
        <style>
          body { font-family: 'Nunito', Arial, sans-serif; line-height: 1.6; }
        </style>
      </head>
      <body>
        <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; font-family: 'Nunito', Helvetica, Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background-color: #007AFF; color: #fff; padding: 30px; text-align: center;">
              <img src="cid:monthlyBanner" alt="Daily Checkin Banner" style="max-width: 200px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
              <h1 style="font-size: 28px; font-weight: 700; margin: 0;">Hello, ${userName}!</h1>
              <p style="font-size: 16px; margin-top: 10px;">A New Month, A New Opportunity</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px; line-height: 1.6;">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">As we step into a new month, we want to take a moment to acknowledge your incredible journey and the consistent effort you've been putting into your daily goals.</p>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Every day is a chance to grow, learn, and become a better version of yourself. Your commitment to personal growth is truly inspiring. Remember, progress isn't about perfection – it's about persistence.</p>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">We're here to support you every step of the way. Whether you're facing challenges or celebrating victories, our team is dedicated to helping you succeed.</p>
              
              <div style="background-color: #F5F5F5; border-left: 4px solid #007AFF; padding: 15px; margin-bottom: 20px;">
                <p style="font-size: 15px; color: #555; font-style: italic; margin: 0;">"Success is the sum of small efforts, repeated day in and day out." - Robert Collier</p>
              </div>
              
              <p style="font-size: 16px; color: #888; margin-top: 30px;">Warmest regards,<br>
              <strong>The Daily Checkin Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
              © 2024 Daily Checkin. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
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