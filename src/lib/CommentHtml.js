export function generateEmailHTML(postOwner, commentAuthor, content, postId) {
  const postUrl = `https://daily-check-in.com.ng/comment/${postId}`
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Comment Notification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fb;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 30px;
          }
          h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 10px;
          }
          .comment {
            background-color: #fafafa;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin-top: 20px;
            border-radius: 4px;
            font-style: italic;
          }
          .cta-button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Comment on Your Post</h1>
          <p>Hello ${postOwner},</p>
          <p><strong>${commentAuthor}</strong> left a comment on your post:</p>
          <div class="comment">
            "${content}"
          </div>
           <a href="${postUrl}" class="cta-button">View Comment</a>
        </div>
      </body>
      </html>
  `
}






export function generateCommentHtml(postOwner, commentAuthor, content, postId) {
  const postUrl = `https://daily-check-in.com.ng/comment/${postId}`
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Comment on Post</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fb;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 30px;
          }
          h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 10px;
          }
          p {
            font-size: 16px;
            margin-bottom: 15px;
          }
          .comment {
            background-color: #fafafa;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin-top: 20px;
            border-radius: 4px;
            font-style: italic;
          }
          .cta-button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Hello ${postOwner},</p>
          <h1>New Comment on a Post You Engaged With</h1>
          <p><strong>${commentAuthor}</strong> left a comment on a discussion you were part of:</p>
          <div class="comment">
            "${content}"
          </div>
          <a href="${postUrl}" class="cta-button">View Comment</a>
        </div>
      </body>
      </html>
  `
}

export function generateReplyEmailHTML(
  commentAuthor,
  replyContent,
  postId,
  postTitle
) {
  const postUrl = `https://daily-check-in.com.ng/comment/${postId}`
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Reply Notification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7fb;
          margin: 0;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }
        h1 {
          color: #2c3e50;
          font-size: 22px;
          margin-bottom: 10px;
        }
        blockquote {
          font-size: 16px;
          border-left: 4px solid #3498db;
          padding: 15px;
          background-color: #fafafa;
          margin-top: 20px;
          border-radius: 4px;
          font-style: italic;
        }
        .cta-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        footer {
          font-size: 14px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>New Reply to Your Comment</h1>
        <p><strong>${commentAuthor}</strong>, your comment on the post "${postTitle}" has received a new reply:</p>
        <blockquote>${replyContent}</blockquote>
        <a href="${postUrl}" class="cta-button">View Full Post and Conversation</a>
        <footer>
          Best regards,<br/>
          Makinde Olaitan
        </footer>
      </div>
    </body>
    </html>
  `
}
