export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Village Rentals App</h1>
      <p className="text-lg text-gray-600 mb-2">Manage your equipment, customers, and rentals</p>
      <a href="/equipment" className="text-blue-600 underline">
        Go to Equipment Page
      </a>
    </main>
  );
}
