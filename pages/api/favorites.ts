// API route which is only going to load our favorite movies (To fetch all of our favorites)
import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb'
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try {
        // Limit this route only to GET method
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        const { currentUser } = await serverAuth(req, res);
        
        // Find all movies which have a relation to current user favorite IDs list, otherwise known as their favorite movies 
        const favoritedMovies = await prismadb.movie.findMany({
            where: {
                id: {
                    in: currentUser?.favouriteIds,
                }
            }
        });

        return res.status(200).json(favoritedMovies);
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}