"use server";

import { Novu } from "@novu/api";
import { NOVU_SERVER_CONFIG, NOVU_CONFIG } from "@/utils/constants";

// Register FCM device token for a Novu subscriber
export async function registerFcmToken(
  subscriberId: string,
  token: string
) {
  const secretKey = NOVU_SERVER_CONFIG.SECRET_KEY;
  const serverUrl = NOVU_CONFIG.API_URL;

  if (!secretKey) {
    console.error("NOVU_SECRET_KEY missing");
    return { success: false };
  }

  try {
    const response = await fetch(
      `${serverUrl}/v1/subscribers/${subscriberId}/credentials`,
      {
        method: "PUT",
        headers: {
          Authorization: `ApiKey ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: "fcm",
          credentials: {
            deviceTokens: [token],
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    return { success: true };
  } catch (error) {
    console.error("Error registering FCM token", error);
    return { success: false };
  }
}

//Trigger login success notification
export async function triggerLoginNotification(
  subscriberId: string
) {
  const secretKey = NOVU_SERVER_CONFIG.SECRET_KEY;
  const serverUrl = NOVU_CONFIG.API_URL;

  if (!secretKey) {
    console.error("NOVU_SECRET_KEY missing");
    return { success: false };
  }

  const novu = new Novu({
    secretKey,
    serverURL: serverUrl,
  });

  try {
    const response = await novu.trigger({
      workflowId: "chat-based-workflow",
      to: { subscriberId },
      payload: {
        title: "Welcome Back!",
        description:
          "You have successfully logged into the chat workflow.",
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Error triggering notification", error);
    return { success: false };
  }
}
