export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-6">Bienvenue sur Ads-to-Earn 🚀</h1>
      <p className="mb-8 text-gray-300">Regarde des publicités et gagne des points !</p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Connexion
        </a>
        <a
          href="/register"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Inscription
        </a>
      </div>
    </div>
  );
}
