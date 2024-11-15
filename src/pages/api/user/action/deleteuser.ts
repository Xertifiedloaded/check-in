import { prisma } from "@/lib/prisma";


export default async function deleteUserHandler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query; 

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      message: 'User deleted successfully',
      deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
