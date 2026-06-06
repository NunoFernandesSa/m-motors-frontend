"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-xl font-bold text-red-600">
        Une erreur est survenue
      </h2>
      <p>{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
      >
        Réessayer
      </button>
    </div>
  );
}
