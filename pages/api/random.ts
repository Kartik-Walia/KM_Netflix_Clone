import { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Limit this function to only work on GET request method
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req);  // All i wanna do is check if we're logged in (thatswhy we're not extracting the current user)

        // Let's find our random movie that'll be loaded every time we refresh the page
        const movieCount = await prismadb.movie.count();    // We want to get counts of all movies is our database wihtout loading them 
        const randomIndex = Math.floor(Math.random() * movieCount);    // Creating random index using this movieCount (generates random ineteger)

        // Finding the random movie object from the database
        const randomMovies = await prismadb.movie.findMany({
            take: 1,
            skip: randomIndex
        });    // So we're using pagination to make our algorithm for a random movie

        // This is an array, we only want 1 movie so just pick only one inside, I know it's going to be 0 the only one bcoz i explicitly say take only one from this many movies
        return res.status(200).json(randomMovies[0])
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}