import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "DazPay – Solution de paiement Bitcoin & Lightning | Dazno",
  description: "DazPay vous permettra bientôt d'accepter facilement les paiements Bitcoin et Lightning pour votre activité. Contactez-nous pour en savoir plus.",
};

export default function DazPayPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">
        DazPay : acceptez les paiements Bitcoin & Lightning
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center mb-10">
        <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
          <Image
            src="/assets/images/dazpay.png"
            alt="DazPay – Paiement Bitcoin & Lightning"
            width={400}
            height={300}
            className="rounded-lg shadow-2xl"
            priority
          />
        </div>
        <div className="md:w-1/2 md:pl-10">
          <h2 className="text-2xl font-semibold mb-4">Bientôt disponible !</h2>
          <p className="mb-4">
            DazPay vous permettra prochainement d'accepter simplement les paiements Bitcoin et Lightning pour votre commerce ou activité en ligne.
          </p>
          <p className="mb-4">
            Pour être informé du lancement ou pour toute question, n'hésitez pas à nous contacter.
          </p>
          <Link href="/contact">
            <span className="inline-block bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition cursor-pointer">
              Nous contacter
            </span>
          </Link>
        </div>
      </div>
      <section className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-3">Pourquoi accepter Bitcoin&nbsp;?</h2>
        <p className="mb-2">
          Accepter Bitcoin et le Lightning Network, c'est offrir à vos clients une solution de paiement rapide, sécurisée et sans frontières. DazPay simplifiera cette intégration, sans complexité technique.
        </p>
        <p className="mb-2">
          Restez à l'écoute pour découvrir toutes les fonctionnalités de DazPay très bientôt&nbsp;!
        </p>
      </section>
    </main>
  );
} 