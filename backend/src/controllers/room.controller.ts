import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRoom: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { name } = req.body;
        const userId = req.user.userId;

        const room = await prisma.room.create({
            data: {
                name,
                hostId: userId,
                participants: {
                    connect: { id: userId } // Host automatically joins the room
                }
            },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json(room);
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
};

export const getRooms: RequestHandler = async (req, res): Promise<void> => {
    try {
        const rooms = await prisma.room.findMany({
            where: {
                isActive: true
            },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        participants: true
                    }
                }
            }
        });

        res.json(rooms);
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};