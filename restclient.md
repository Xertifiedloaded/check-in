# Testing GET request to fetch s
GET http://localhost:3000/api/s
Content-Type: application/json

# Testing POST request to like a post
POST http://localhost:3000/api/posts/like
Content-Type: application/json
{
  "userId": "64f43a8a629...",
  "postId": "64f47ad5b2c..."
}
