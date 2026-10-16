# Portfolio — VEGBE Koffi Alex (React)

Version React (Vite) du portfolio :

- **Bilingue FR / EN** et **mode clair / sombre** (choix mémorisés)
- **Palette** : noir profond, bleu nuit, bleu électrique, cyan (tokens en haut de `src/styles/global.css`)
- **Sections** : Accueil (badge de disponibilité), À propos, Services, Projets, Compétences, Parcours (timeline), Défi interactif, Contact
- **Défi** : trouver 5 bugs dans un code Arduino (score, chrono, record local)
- **3 mini-apps** en composants : Lettres Mystères, Calculateur de prêt, Laboratoire de boucles
- Formulaire de contact (Formspree), images WebP, transitions animées

## Lancer
```bash
npm install
npm run dev
npm run build
```

## Modifier le contenu
| Je veux changer…                         | Fichier |
| ---------------------------------------- | ------- |
| Textes FR / EN                           | `src/i18n/fr.js`, `src/i18n/en.js` |
| Disponibilité (`AVAILABLE`), parcours, compétences, projets, liens | `src/data/content.js` |
| Code et bugs du défi                     | `src/data/challenge.js` |
| Couleurs                                 | haut de `src/styles/global.css` |
| Images                                   | `public/images/` |

## Déploiement GitHub Pages
Poussez sur `main`, puis **Settings → Pages → Source : GitHub Actions**. Le workflow `.github/workflows/deploy.yml` fait le reste (`HashRouter` + `base: './'`).
