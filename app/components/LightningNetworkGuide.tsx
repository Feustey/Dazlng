interface Section {
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    title: "Introduction au Lightning Network",
    content:
      "Le Lightning Network est une solution de couche 2 pour Bitcoin qui permet des transactions rapides et peu coûteuses. Il utilise des canaux de paiement pour effectuer des transactions hors chaîne.",
  },
  {
    title: "Avantages du Lightning Network",
    content:
      "Les principaux avantages sont : transactions instantanées, frais minimes, scalabilité améliorée et confidentialité renforcée. C&apos;est idéal pour les micropaiements et les transactions quotidiennes.",
  },
  {
    title: "Comment ça marche",
    content:
      "Le Lightning Network crée un réseau de canaux de paiement entre les utilisateurs. Les transactions sont validées par les nœuds du réseau sans avoir besoin d&apos;être enregistrées sur la blockchain Bitcoin.",
  },
  {
    title: "Sécurité",
    content:
      "La sécurité est garantie par les contrats HTLC (Hash Time-Locked Contracts) et la possibilité de fermer un canal à tout moment. Les fonds ne peuvent être dépensés que par le propriétaire légitime.",
  },
  {
    title: "Utilisation pratique",
    content:
      "Pour utiliser le Lightning Network, vous avez besoin d&apos;un portefeuille compatible. Les transactions sont simples : scannez un QR code ou copiez une facture Lightning pour payer.",
  },
];
