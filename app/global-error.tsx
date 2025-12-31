'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-white">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">System Failure</h2>
                    <p className="mb-8 text-gray-600">We apologize for the inconvenience. Please try refreshing.</p>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
