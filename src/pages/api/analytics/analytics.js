
import { getAnalytics, trackVisit, updateVisitDuration } from '@/controller/analyticsController';


export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getAnalytics(req, res);
    case 'POST':
      return trackVisit(req, res);
    case 'PUT':
      return updateVisitDuration(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
