export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white flex-col">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">La page que vous cherchez est introuvable.</p>
      <a
        href="/"
        className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
      >
        Retour à l’accueil
      </a>
    </div>
  );
}
