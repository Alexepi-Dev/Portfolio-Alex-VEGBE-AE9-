# Classement partagé de Lettres Mystères

1. Créez un projet Supabase.
2. Dans l’éditeur SQL du projet, exécutez [`schema.sql`](./schema.sql).
3. Copiez `.env.example` vers `.env.local` à la racine du projet.
4. Remplacez les deux valeurs par l’URL du projet et sa clé `anon`/`publishable` (Project Settings → API).
5. Redémarrez le serveur Vite ou reconstruisez le site après avoir configuré les variables.

Le classement conserve les dix meilleurs scores par langue et se met à jour en temps réel pour les joueurs connectés. Le nom et le score sont envoyés à Supabase à la fin de chaque partie.

La clé publique `anon` est destinée à être utilisée dans le navigateur ; ne placez jamais une clé `service_role` dans une variable `VITE_`. Les politiques RLS limitent les noms à 24 caractères et les scores aux valeurs positives, mais un client public peut falsifier un score. Une validation anti-triche nécessite une logique serveur dédiée.
