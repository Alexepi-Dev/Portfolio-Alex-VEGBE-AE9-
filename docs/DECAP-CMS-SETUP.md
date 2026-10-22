# Configuration de Decap CMS

## Architecture

Decap CMS 3.17.1 est servi depuis `public/admin/` et utilise le backend hébergé `turbo-github`. Les actualités et articles sont des fichiers Markdown dans `src/content/actualites/` et `src/content/articles/`; les images envoyées par le CMS sont enregistrées dans `public/images/uploads/`. Le site lit ces fichiers au moment du build Vite.

La publication est directe : après validation dans le CMS, le backend Turbo crée un commit sur `main`. Netlify doit ensuite exécuter son build de production. Le mode brouillon/editorial workflow n’est pas activé : les contenus enregistrés sur la branche de production deviennent des contenus publics au prochain déploiement.

Le backend Turbo est inclus dans le bundle stable Decap CMS 3.17.1; le bundle complet enregistre les locales de Decap, dont le français configuré ici. Aucune dépendance CMS n’est ajoutée au frontend. Le site utilise `yaml` pour les métadonnées, `marked` pour le Markdown et `DOMPurify` pour nettoyer le HTML avant son insertion. Le bundle de l’éditeur d’articles est chargé à la demande. Les références officielles sont [Decap Turbo — démarrage](https://decapcms.org/docs/turbo-getting-started/), [connexion d’un site](https://decapcms.org/docs/turbo-connecting-a-site/) et [offres Turbo](https://decapcms.org/turbo/).

## Étapes externes obligatoires

Ces opérations n’ont pas été exécutées depuis le dépôt. L’authentification et la publication ne sont pas considérées opérationnelles avant leur réalisation et un test réel.

1. Créez un compte Decap Turbo et une organisation. Le plan gratuit annoncé par Decap inclut un site et un siège.
2. Dans l’organisation Turbo, connectez GitHub et installez l’application GitHub Turbo sur le compte ou l’organisation qui possède `Alexepi-Dev/Portfolio-Alex-VEGBE-AE9-`. Limitez l’installation à ce dépôt si possible.
3. Créez un site Turbo :
   - dépôt : `Alexepi-Dev/Portfolio-Alex-VEGBE-AE9-`
   - branche : `main`
   - chemin de configuration : `public/admin/config.yml`
   - URL de l’interface : `https://alexvegbeae9.netlify.app/admin/`
4. Le **Site ID** affiché dans l’onglet Overview doit correspondre à la valeur `backend.turbo_site_id` de `public/admin/config.yml`. Cette valeur est configurée localement; confirmez-la dans Turbo si le site est recréé.
6. Vérifiez dans Netlify que le dépôt est bien lié, que la branche de production est `main`, que la commande de build est `npm run build` et que le dossier publié est `dist`.
7. Après déploiement de ces changements sur la branche de production, ouvrez `https://alexvegbeae9.netlify.app/admin/`, connectez-vous avec un membre autorisé du site Turbo et vérifiez que les collections Actualités et Articles se chargent.
8. Créez un contenu de test, téléversez une image, publiez-le et vérifiez le commit sur `main`, le build Netlify et l’affichage public. Supprimez ensuite ce contenu de test depuis le CMS si vous ne souhaitez pas le conserver.

Le dépôt ne contient pas les informations d’authentification GitHub ni la configuration de compte Netlify. Ne placez aucun jeton personnel dans le frontend ou dans `config.yml`. Le Site ID ne donne pas à lui seul accès au site : Turbo contrôle aussi le compte connecté, l’appartenance au site et les URLs autorisées.

Les modifications actuelles sont conservées sur `feature/decap-cms`. Elles doivent être intégrées à `main` par une action autorisée avant que l’URL de production ne serve cette version de l’administration; aucun commit, push ou merge n’a été effectué dans ce travail.

## Contenus, slugs et images

Le CMS crée un fichier Markdown par entrée avec un nom ASCII composé de l’horodatage de création à la seconde et du titre normalisé. L’horodatage prévient les collisions entre titres identiques créés à des moments différents; si deux créations identiques se produisent dans la même seconde, choisissez un titre distinct. Le nom de fichier sert d’identifiant de route (`#/actualites/<slug>` ou `#/articles/<slug>`); conservez le nom du fichier lors des modifications pour préserver l’URL.

Les images sont stockées dans `public/images/uploads/` et leurs chemins publics sont enregistrés sous `/images/uploads/...`. Les modifications de contenu et d’images sont versionnées avec GitHub et déployées ensemble.

## Routes publiques

- `#/actualites` et `#/actualites/<slug>`
- `#/articles` et `#/articles/<slug>`

Les fichiers mal formés ou dépourvus de titre, résumé ou date valide sont ignorés avec une erreur explicite dans la console du navigateur. Un dossier sans contenu affiche un état vide localisé. Les pages d’articles définissent le titre du document et sa description.

## Vérifications locales

```sh
npm install
npm run dev
npm run build
```

Vite copie `public/admin/` vers `dist/admin/`. La présence du Site ID dans la configuration permet de cibler le site Turbo, mais ne prouve pas que l’authentification ou les permissions sont opérationnelles. Le test local du build ne vérifie ni l’authentification externe, ni les permissions GitHub, ni le téléversement distant, ni le déploiement Netlify.

## Dépannage et sécurité

- **Site ID invalide / configuration indisponible** : confirmez le Site ID dans Turbo et que `public/admin/config.yml` est le chemin sélectionné lors de la création du site.
- **Login refusé** : ajoutez l’URL d’administration exacte à la liste des Admin interface URLs Turbo et vérifiez que le compte est membre du site.
- **Dépôt ou branche refusé** : vérifiez dans Turbo l’installation de l’application GitHub, la sélection du dépôt et la branche `main`.
- **Publication non visible** : vérifiez le commit sur `main`, le résultat du build Netlify et les erreurs dans les journaux de déploiement.
- **Image absente** : vérifiez que le fichier a été commité dans `public/images/uploads/` et que le chemin enregistré commence par `/images/uploads/`.

L’URL `/admin/` n’est pas un mécanisme de sécurité. Maintenez une liste d’utilisateurs autorisés dans Turbo, n’accordez à l’application GitHub que l’accès requis et ne stockez aucun secret côté navigateur.
