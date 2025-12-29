"use server";

import { serverRequest } from "@/lib/server/client";
import { NOVU_SERVER_CONFIG, NOVU_CONFIG } from "@/utils/constants";

export async function registerFcmToken(
  subscriberId: string,
  token: string
) {
  const secretKey = NOVU_SERVER_CONFIG.SECRET_KEY;
  if (!secretKey) return { success: false };

  try {
    await serverRequest({
      url: `${NOVU_CONFIG.API_URL}/v1/subscribers/${subscriberId}/credentials`,
      method: "PUT",
      token: secretKey,
      body: {
        providerId: "fcm",
        credentials: {
          deviceTokens: [token],
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("FCM token registration failed", error);
    return { success: false };
  }
}

