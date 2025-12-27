"use server";

import { Novu } from '@novu/api';

import { NOVU_SERVER_CONFIG, NOVU_CONFIG } from '@/utils/constants';

export async function triggerLoginNotification(subscriberId: string) {
    const secretKey = NOVU_SERVER_CONFIG.SECRET_KEY;
    const serverUrl = NOVU_CONFIG.API_URL;

    if (!secretKey) {
        console.error("Configuration Error: NOVU_SECRET_KEY missing");
        return { success: false, error: "Configuration Error: NOVU_SECRET_KEY missing" };
    }

    const novu = new Novu({
        secretKey: secretKey,
        serverURL: serverUrl,
    });

    try {
        const response = await novu.trigger({
            workflowId: 'chat-based-workflow',
            to: {
                subscriberId: subscriberId,
            },
            payload: {
                title: "Welcome Back!",
                description: "You have successfully logged into the chat workflow.",
            },
        });
        return { success: true, data: response };
    } catch (error) {
        console.error("Error triggering notification", error);
        return { success: false, error: "Failed to trigger notification" };
    }
}
