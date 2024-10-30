import { prisma } from "@/lib/prisma";

export async function getAnalytics(req, res) {
    try {
      const totalVisitors = await prisma.visitor.count();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const dailyVisitors = await prisma.visitor.count({
        where: {
          visitDate: {
            gte: today,
          },
        },
      });
  
      const avgDuration = await prisma.visitor.aggregate({
        _avg: {
          duration: true,
        },
      });
  
      const hourlyBreakdown = await prisma.visitor.groupBy({
        by: ['visitDate'],
        where: {
          visitDate: {
            gte: new Date(new Date().setHours(new Date().getHours() - 24)),
          },
        },
        _count: {
          id: true,
        },
      });
  
      const pageViews = await prisma.pageView.groupBy({
        by: ['path'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 5,
      });
  
      const deviceTypes = await prisma.visitor.groupBy({
        by: ['deviceType'],
        _count: {
          id: true,
        },
      });
  
      const activeVisitors = await prisma.visitor.count({
        where: {
          lastActivity: {
            gte: new Date(new Date().setMinutes(new Date().getMinutes() - 5)),
          },
        },
      });
  
      res.status(200).json({
        totalVisitors,
        dailyVisitors,
        avgDuration: Math.round(avgDuration._avg?.duration || 0),
        hourlyBreakdown,
        pageViews,
        deviceTypes,
        activeVisitors,
      });
    } catch (error) {
      console.error('Error retrieving analytics:', error);
      res.status(500).json({ error: 'Error retrieving analytics' });
    }finally {
      await prisma.$disconnect();
    }
  }
  
  export async function trackVisit(req, res) {
    const { ip, userAgent, page } = req.body;
  
    if (!ip || !userAgent || !page) {
      return res.status(400).json({ message: 'Missing required information' });
    }
  
    try {
      const visitor = await prisma.visitor.upsert({
        where: { ip },
        update: { 
          lastActivity: new Date(),
          deviceType: getDeviceType(userAgent),
        },
        create: { 
          ip, 
          duration: 0, 
          deviceType: getDeviceType(userAgent),
        },
      });
  
      await prisma.pageView.create({
        data: {
          visitorId: visitor.id,
          path: page,
        },
      });
  
      res.status(200).json({ message: 'Visit tracked', visitorId: visitor.id });
    } catch (error) {
      console.error('Error tracking visitor:', error);
      res.status(500).json({ error: 'Error tracking visitor' });
    }finally {
      await prisma.$disconnect();
    }
  }
  
  export async function updateVisitDuration(req, res) {
    const { visitorId, duration } = req.body;
  
    if (!visitorId || typeof duration !== 'number') {
      return res.status(400).json({ message: 'Invalid visitorId or duration' });
    }
  
    try {
      await prisma.visitor.update({
        where: { id: visitorId },
        data: { 
          duration,
          lastActivity: new Date(),
        },
      });
  
      res.status(200).json({ message: 'Visit duration updated successfully' });
    } catch (error) {
      console.error('Error updating visit duration:', error);
      res.status(500).json({ error: 'Error updating visit duration' });
    }finally {
      await prisma.$disconnect();
    }
  }
  
  function getDeviceType(userAgent) {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }