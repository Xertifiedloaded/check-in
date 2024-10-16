export function generateEmailHTML(postOwner, commentAuthor, content) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Comment Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          .comment {
            background-color: #fff;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin-top: 20px;
            border-radius: 0 5px 5px 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #3498db;
            color: #ffffff !important;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Comment on Your Post</h1>
          <p>Hello ${postOwner.name},</p>
          <p><strong>${commentAuthor}</strong> has left a comment on your post:</p>
          <div class="comment">
            "${content}"
          </div>
          <a href="www.daily-check-in.com.ng" class="cta-button">View Comment</a>
        </div>
      </body>
      </html>
    `
}
export function generateCommentHtml(postOwner, commentAuthor, content) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Comment on Post</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f4f4f4;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            font-size: 24px;
          }
          p {
            font-size: 16px;
            margin-bottom: 15px;
          }
          .comment {
            background-color: #ffffff;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
            font-style: italic;
          }
          .cta-button {
            display: inline-block;
            background-color: #3498db;
            color: #ffffff !important;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Comment on a Post You Engaged With</h1>
          <p>We wanted to inform you that <strong>${commentAuthor}</strong> has posted a new comment on a discussion you were part of:</p>
          <div class="comment">
            "${content}"
          </div>
          <p>To view the full conversation, click the button below:</p>
          <a href="www.daily-check-in.com.ng" class="cta-button">View Comment</a>
        </div>
      </body>
      </html>
    `
}

export function generateReplyEmailHTML(commentAuthor, replyContent) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
      <h1 style="color: #333;">Hello ${commentAuthor},</h1>
      <p style="font-size: 16px; color: #555;">
        Your comment has received a new reply:
      </p>
      <blockquote style="margin: 15px 0; padding: 10px 15px; border-left: 4px solid #007BFF; background-color: #fff; color: #444; border-radius: 4px;">
        ${replyContent}
      </blockquote>
      <p style="font-size: 16px; color: #555;">
        Thank you for participating!
      </p>
      <footer style="margin-top: 20px; font-size: 14px; color: #888;">
        Best regards,<br />
Makinde Olaitan
      </footer>
    </div>
  `
}
