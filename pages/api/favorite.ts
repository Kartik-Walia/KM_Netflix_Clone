// API route to add or remove our favorites
import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '@/lib/prismadb'
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Handling POST request (User favoriting a movie)
        if (req.method === 'POST') {
            const { currentUser } = await serverAuth(req, res);

            const { movieId } = req.body;

            // Find the movie suign the movieId
            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            // Update favorite movie of a user to it's Id
            const user = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favouriteIds: {
                        push: movieId,
                    }
                }
            });

            return res.status(200).json(user);
        }

        // Handling DELETE request (User unfavoriting a movie)
        if (req.method === 'DELETE') {
            const { currentUser } = await serverAuth(req, res);

            const { movieId } = req.body;

            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if(!existingMovie) {
                throw new Error('Invalid ID');
            }

            // Update list of favorite ids
            const updatedFavoriteIds = without(currentUser.favouriteIds, movieId);

            const updatedUser = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favouriteIds: updatedFavoriteIds,
                }
            });

            return res.status(200).json(updatedUser);
        }

        // If we get a method which is neither POST or DELETE
        return res.status(405).end();
    } catch (error) {
        console.log(error);

        return res.status(500).end();
    }
}