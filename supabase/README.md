# Classement partagé de Lettres Mystères

1. Créez un projet Supabase.
2. Dans l’éditeur SQL du projet, exécutez [`schema.sql`](./schema.sql) pour créer la table, les règles d’accès publiques et le canal temps réel.
3. Copiez `.env.example` vers `.env.local` à la racine du projet.
4. Dans Project Settings → API, remplacez les valeurs d’exemple par l’URL du projet et sa clé publique `anon`/`publishable`.
5. Redémarrez le serveur Vite ou reconstruisez le site pour que les variables soient prises en compte.

Une fois configuré, le classement conserve les dix meilleurs scores par langue. Chaque visiteur peut consulter les résultats partagés et le classement se met à jour en temps réel. Le nom et le score sont envoyés à Supabase à la fin de chaque partie.

La clé publique `anon`/`publishable` est destinée à être utilisée dans le navigateur ; ne placez jamais une clé `service_role` dans une variable `VITE_`. Les politiques RLS limitent les noms à 24 caractères et les scores aux valeurs positives, mais un client public peut falsifier un score. Une validation anti-triche nécessite une logique serveur dédiée.
