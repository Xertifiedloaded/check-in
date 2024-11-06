import { handleDeleteUserPost, handleUpdateUserPost } from "../../../../controller/ProfilePostController";


export default async function handler(req, res) {
  const { method } = req;
  const postId = req.query.postId;
  const userId = req.body.userId; 

  switch (method) {
    case 'DELETE':
      return handleDeleteUserPost(postId, userId, res);
    case 'PUT':
      return handleUpdateUserPost(postId, userId, req.body, res);
    default:
      res.setHeader('Allow', ['DELETE', 'PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
