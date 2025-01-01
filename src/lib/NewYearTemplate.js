export const happyNewYearTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to 2025 - A Year of Possibilities!</title>
      <style>
        body {
          font-family: 'Nunito', Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        table {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        td {
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .header h1 {
          font-size: 30px;
          margin: 0;
        }
        .header p {
          font-size: 18px;
          margin: 10px 0 0;
        }
        .content {
          color: #333;
          line-height: 1.8;
          font-size: 16px;
        }
        .content p {
          margin-bottom: 20px;
        }
        .highlight {
          background-color: #f1f8e9;
          padding: 15px;
          border-left: 4px solid #4CAF50;
          font-style: italic;
        }
        .footer {
          background-color: #f1f1f1;
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td class="header">
            <img src="cid:newYearBanner2025" alt="New Year 2025 Banner" style="max-width: 180px; margin-bottom: 15px;">
            <h1>Happy New Year, ${userName}!</h1>
            <p>Your Year of Boundless Opportunities</p>
          </td>
        </tr>
        <tr>
          <td class="content">
            <p>Welcome to 2025, a year full of promise and potential! We’re thrilled to have you as part of our Daily Checkin family as we embark on this journey together.</p>
            <p>This year is your blank canvas to paint dreams, achieve goals, and embrace new beginnings. Remember, every small step forward is a victory worth celebrating.</p>
            <div class="highlight">
              "Write it on your heart that every day is the best day in the year." - Ralph Waldo Emerson
            </div>
            <p>Thank you for letting us be a part of your story. Here's to making 2025 unforgettable!</p>
          </td>
        </tr>
        <tr>
          <td class="footer">
            &copy; 2025 Daily Checkin. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
