import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "DazBox – Générez un revenu passif avec le Lightning Network | Dazno",
  description: "La DazBox vous permet de participer à la décentralisation du réseau Bitcoin et de générer un revenu passif grâce au Lightning Network. Découvrez une solution clé en main, simple, sécurisée et open source.",
};

export default function DazBoxPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">
        DazBox : votre nœud Lightning clé en main
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center mb-10">
        <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
          <Image
            src="/assets/images/dazbox.png"
            alt="DazBox – Nœud Lightning"
            width={400}
            height={300}
            className="rounded-lg shadow-2xl"
            priority
          />
        </div>
        <div className="md:w-1/2 md:pl-10">
          <h2 className="text-2xl font-semibold mb-4">Générez un revenu passif, soutenez la décentralisation</h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Revenu passif :</strong> Gagnez des sats en relayant des transactions Lightning sur votre propre nœud.</li>
            <li><strong>Décentralisation :</strong> Participez activement à la résilience du réseau Bitcoin.</li>
            <li><strong>Contrôle total :</strong> Vos clés, vos règles. Gardez le contrôle sur vos fonds et votre vie privée.</li>
            <li><strong>Simplicité :</strong> Installation plug & play, interface intuitive, aucune compétence technique requise.</li>
            <li><strong>Sécurité :</strong> Matériel dédié, système d'exploitation open source, mises à jour automatiques.</li>
            <li><strong>Open source :</strong> Basé sur des technologies éprouvées et transparentes.</li>
          </ul>
          <Link href="/checkout/daznode?product=Dazbox&amount=300">
            <span className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition cursor-pointer">
              Commander la DazBox
            </span>
          </Link>
        </div>
      </div>
      {/* QR code temporaire pour test du funnel */}
      <div className="flex flex-col items-center mb-10">
        <h3 className="text-lg font-semibold mb-2 text-center text-red-600">QR code temporaire pour test du funnel</h3>
        <Image
          src="/assets/images/qr-dazbox-temp.png"
          alt="QR code Wallet of Satoshi temporaire"
          width={300}
          height={300}
          className="rounded-lg border-2 border-yellow-400 shadow-lg"
          priority
        />
        <p className="text-sm text-gray-500 mt-2 text-center">Ce QR code est utilisé uniquement pour les tests du tunnel d'achat.</p>
      </div>
      <section className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-3">Qu'est-ce que le Lightning Network&nbsp;?</h2>
        <p className="mb-2">
          Le Lightning Network est une solution de paiement de seconde couche pour Bitcoin, conçue pour permettre des transactions instantanées, à faible coût et hautement scalables. En ouvrant des canaux de paiement entre utilisateurs, il permet d'effectuer des paiements sans attendre la confirmation de la blockchain principale.
        </p>
        <p className="mb-2">
          En hébergeant un nœud Lightning avec la DazBox, vous facilitez ces transactions et pouvez percevoir des frais de routage, générant ainsi un revenu passif tout en renforçant la décentralisation du réseau.
        </p>
        <p className="mb-2">
          <strong>Pourquoi choisir la DazBox&nbsp;?</strong> Parce qu'elle simplifie l'accès à cette technologie de pointe, tout en vous offrant sécurité, autonomie et simplicité d'utilisation.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Pour en savoir plus, consultez la <a href="https://docs.dazno.de" target="_blank" rel="noopener noreferrer" className="underline">documentation Dazno</a>.
        </p>
      </section>
    </main>
  );
}