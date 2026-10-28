# Portfolio — VEGBE Koffi Alex (React)

Version React (Vite) du portfolio :

- **Bilingue FR / EN** et **mode clair / sombre** (choix mémorisés)
- **Palette** : noir profond, bleu nuit, bleu électrique, cyan (tokens en haut de `src/styles/global.css`)
- **Sections** : Accueil (badge de disponibilité), À propos, Services, Projets, Compétences, Parcours (timeline), Défi interactif, Contact
- **Défi** : trouver 5 bugs dans un code Arduino (score, chrono, record local)
- **3 mini-apps** en composants : Lettres Mystères, Calculateur de prêt, Laboratoire de boucles
- Formulaire de contact (Formspree), images WebP, transitions animées
- Actualités et articles gérés par Decap CMS, avec contenu Markdown versionné dans Git

## Lancer
```bash
npm install
npm run dev
npm run build
```

## Qualité et tests
```bash
npm run lint
npm test
npm run build
```

Les vérifications lint, tests unitaires et build sont également exécutées automatiquement par GitHub Actions sur les changements vers `main` et les pull requests.

## Référencement Google

La page expose des métadonnées Open Graph, Twitter, une URL canonique, un fichier `robots.txt`, un sitemap XML et des données structurées `Person`.

Pour vérifier le site dans Google Search Console :

1. Ajoutez la propriété `https://alexvegbeae9.netlify.app/`.
2. Choisissez la méthode de vérification par balise HTML.
3. Copiez uniquement la valeur du paramètre `content`.
4. Placez cette valeur dans `VITE_GOOGLE_SITE_VERIFICATION` du fichier `.env.local`.
5. Reconstruisez et déployez le site, puis validez la propriété dans Search Console.
6. Soumettez l’adresse `https://alexvegbeae9.netlify.app/sitemap.xml` dans le menu **Sitemaps**.

## Modifier le contenu
| Je veux changer…                         | Fichier |
| ---------------------------------------- | ------- |
| Textes FR / EN                           | `src/i18n/fr.js`, `src/i18n/en.js` |
| Disponibilité (`AVAILABLE`), parcours, compétences, projets, liens | `src/data/content.js` |
| Code et bugs du défi                     | `src/data/challenge.js` |
| Couleurs                                 | haut de `src/styles/global.css` |
| Images                                   | `public/images/` |

La configuration et les étapes d’activation de Decap CMS sont décrites dans [`docs/DECAP-CMS-SETUP.md`](./docs/DECAP-CMS-SETUP.md). L’authentification Turbo doit être configurée avant d’utiliser `/admin/`.

## Déploiement Netlify
Site : [alexvegbeae9.netlify.app](https://alexvegbeae9.netlify.app/).

Paramètres de production à vérifier dans Netlify :

- Branche : `main`
- Commande de build : `npm run build`
- Dossier publié : `dist`

Le portfolio utilise `HashRouter` et conserve `base: './'`. Aucun fichier de configuration Netlify n’est suivi dans ce dépôt; ces paramètres doivent donc être confirmés dans le tableau de bord Netlify.
