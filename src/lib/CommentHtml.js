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
