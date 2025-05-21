const fs = require('fs');
const _path = require('path');
const { glob } = require('glob');

// Mapping des anciens noms d'icônes vers les nouveaux noms AppIcon
const iconMap = {
  // Feather/Fi
  FiFileText: 'file',
  FiShield: 'shield',
  FiAlertTriangle: 'alert',
  FiCheckCircle: 'check',
  FiXCircle: 'x',
  // FontAwesome/Fa
  FaFileAlt: 'file',
  FaShieldAlt: 'shield',
  FaExclamationTriangle: 'alert',
  FaCheckCircle: 'check',
  FaTimesCircle: 'x',
};

(async () => {
  const files = await glob('**/*.tsx', { ignore: ['node_modules/**', '.next/**'] });

  files.forEach(file => {
    if (!fs.statSync(file).isFile()) return;

    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    let modified = false;

    // Supprime les imports react-icons/fi et react-icons/fa
    content = content.replace(/import\s+\{[^}]*\}\s+from\s+['"]react-icons\/(fi|fa)['"];?\n?/g, _match => {
      modified = true;
      return '';
    });

    // Ajoute l'import AppIcon si besoin
    if (/Fi|Fa/.test(content) && !/AppIcon/.test(content)) {
      content = `import AppIcon from '@/components/shared/ui/AppIcon';\n` + content;
      modified = true;
    }

    // Remplace les balises d'icônes par <AppIcon name="..." ... />
    Object.entries(iconMap).forEach(([old, replacement]) => {
      // <FiFileText size={32} className="..." /> ou <FaFileAlt ... />
      const regex = new RegExp(`<${old}([^>]*)\/?>`, 'g');
      content = content.replace(regex, (match, attrs) => {
        modified = true;
        // Récupère size et className
        let size = /size=\{(\d+)\}/.exec(attrs);
        let className = /className=\"([^\"]*)\"/.exec(attrs);
        let alt = '';
        switch (replacement) {
          case 'file': alt = 'Fichier'; break;
          case 'shield': alt = 'Bouclier'; break;
          case 'alert': alt = 'Alerte'; break;
          case 'check': alt = 'Valide'; break;
          case 'x': alt = 'Interdit'; break;
        }
        return `<AppIcon name=\"${replacement}\"${size ? ` size={${size[1]}}` : ''}${className ? ` className=\"${className[1]}\"` : ''} alt=\"${alt}\" />`;
      });
    });

    if (modified && content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Icônes remplacées dans : ${file}`);
    }
  });

  console.log('Migration automatique des icônes terminée.');
})(); 