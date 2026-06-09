import Image from "next/image";

const HomePage = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Hero section */}
      <header className="text-center mb-16 min-h-150 flex items-center justify-center">
        <div className="">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bienvenue chez <span className="text-blue-600">M-Motors</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            L&apos;expertise automobile au service de vos projets, que ce soit
            pour un achat ou une location longue durée.
          </p>
        </div>
        <div className="">
          <Image
            src="/images/cars/bmw.jpg"
            alt="M-Motors"
            width={100}
            height={100}
            className="mb-4"
          />
        </div>
      </header>

      {/* Company values section (Advantages) section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div className="text-blue-600 text-3xl mb-3">🔧</div>
          <h3 className="text-xl font-medium mb-2">Véhicules contrôlés</h3>
          <p className="text-gray-600">
            Chaque véhicule passe par une inspection technique rigoureuse.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div className="text-blue-600 text-3xl mb-3">📄</div>
          <h3 className="text-xl font-medium mb-2">Garantie incluse</h3>
          <p className="text-gray-600">
            Tous nos véhicules bénéficient d&apos;une garantie 12 mois.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div className="text-blue-600 text-3xl mb-3">🚗</div>
          <h3 className="text-xl font-medium mb-2">Location longue durée</h3>
          <p className="text-gray-600">
            Des formules flexibles pour rouler sans souci d&apos;entretien.
          </p>
        </div>
      </section>

      {/* Company presentation section */}
      <section className="max-w-3xl mx-auto mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Qui sommes-nous ?
          </h2>
          <p className="text-gray-700 mb-4">
            Fondée en 2015, <strong>M-Motors</strong> est une entreprise
            familiale passionnée par l&apos;automobile. Notre mission est de
            rendre l&apos;expérience d&apos;achat ou de location de véhicules
            aussi simple, transparente et agréable que possible.
          </p>
          <p className="text-gray-700">
            Grâce à notre réseau de partenaires et notre rigueur dans la
            sélection des véhicules, nous vous proposons des voitures récentes,
            bien entretenues et garanties. Que vous cherchiez une citadine
            économique ou une berline confortable, nous avons ce qu&apos;il vous
            faut.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
