'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Something went wrong!</h2>
            <p className="mb-6 text-gray-600 max-w-md">{error.message || 'An unexpected error occurred'}</p>
            <button
                onClick={() => reset()}
                className="px-5 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
                Try again
            </button>
        </div>
    );
}
