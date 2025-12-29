"use server";

import { Novu } from "@novu/api";
import { NOVU_SERVER_CONFIG, NOVU_CONFIG } from "@/utils/constants";


export async function triggerLoginNotification(
  subscriberId: string
) {
  const secretKey = NOVU_SERVER_CONFIG.SECRET_KEY;
  if (!secretKey) return { success: false };

  const novu = new Novu({
    secretKey,
    serverURL: NOVU_CONFIG.API_URL,
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
    console.error("Trigger failed", error);
    return { success: false };
  }
}
