import { handleGetProfile,handleUpdateProfile,handleDeleteProfilePicture } from "../../../../controller/UserProfileController";


export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    try {
      const { method } = req;
      const userId = method === 'GET' ? req.query.userId : req.body.userId;
  
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID must be provided."
        });
      }

      switch (method) {
        case 'GET':
          return await handleGetProfile(userId, res);
        
        case 'POST':
          return await handleUpdateProfile({
            userId,
            profilePicture: req.body.imageUrl,
          }, res);
        
        case 'PATCH':
          return await handleUpdateProfile(req.body, res);
        
        case 'DELETE':
          return await handleDeleteProfilePicture(userId, res);
        
        default:
          res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
          return res.status(405).json({
            success: false,
            message: `Method ${method} Not Allowed`
          });
      }
  
    } catch (error) {
      console.error("Error in profile handler:", error);
      return res.status(500).json({
        success: false,
        message: "Server error occurred.",
        error: error.message
      });
    }
  }
  
