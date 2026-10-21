'use server'

//code within here will only run on server

import { currentProfile } from "@/lib/current-profile";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentProfile();

    if(!user) throw new Error('User is not logged in');
    if(!apiKey) throw new Error('No API key');
    if(!apiSecret) throw new Error('No API secret');

    const client = new StreamClient(apiKey, apiSecret);

    //expired in 1 hour
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

    const tokenIssued = Math.floor(Date.now()/1000) - 60;

    const token = client.createToken( user.id, exp, tokenIssued);

    return token;
}