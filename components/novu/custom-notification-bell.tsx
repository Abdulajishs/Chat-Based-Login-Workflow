"use client";

import { NotificationBell, NotificationCenter, useUnseenCount } from '@novu/notification-center';
import { useState } from 'react';

export const CustomNotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useUnseenCount();
    const unseenCount = data?.count;

    return (
        <div className="relative">
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative z-50 cursor-pointer bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                title="Notifications"
            >
                <NotificationBell unseenCount={unseenCount} />
            </div>

            {isOpen && (
                <div className="absolute right-0 top-14 z-50 max-w-[420px] shadow-xl rounded-lg overflow-hidden border border-gray-100 bg-white">
                    <NotificationCenter colorScheme="light" />
                </div>
            )}
        </div>
    );
}
