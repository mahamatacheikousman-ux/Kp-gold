# KP AFRIQUE — V20.0

Projet Vite + React + Tailwind + Supabase, prêt à lancer en local puis à déployer.
Modèle : 0 wallet, 0 livraison, cash sur place. Les seuls paiements dans l'app sont
les abonnements Pro et les boosts de visibilité (CinetPay), jamais côté client.

## Contenu du projet

```
kp-afrique/
├── src/
│   ├── App.jsx          <- le prototype complet (onboarding, marché, pro, etc.)
│   ├── main.jsx
│   ├── index.css
│   └── lib/supabase.js  <- client Supabase (lit les clés dans .env)
├── supabase/
│   └── schema.sql        <- schéma complet à exécuter dans Supabase
├── public/manifest.json  <- pour l'installation PWA
├── .env.example
└── package.json
```

## 1. Lancer en local

Il te faut Node.js installé (version 18 ou plus) sur ton ordinateur.

```bash
cd kp-afrique
npm install
cp .env.example .env
npm run dev
```

Ouvre `http://localhost:5173` — tu verras l'app tourner avec les données de démo
(pas encore connectée à Supabase, c'est l'étape suivante).

## 2. Créer le projet Supabase (Étape 1 de la roadmap)

1. Va sur https://supabase.com, crée un compte, clique "New Project".
2. Une fois le projet créé, va dans **SQL Editor** et colle tout le contenu de
   `supabase/schema.sql`, puis exécute. Ça crée toutes les tables, PostGIS, et
   les règles de sécurité (RLS).
3. Va dans **Project Settings > API**, copie :
   - `Project URL` → colle dans `.env` sous `VITE_SUPABASE_URL`
   - `anon public key` → colle dans `.env` sous `VITE_SUPABASE_ANON_KEY`
4. Active l'authentification par téléphone : **Authentication > Providers > Phone**.
   Pour l'Afrique, Africa's Talking ou Twilio fonctionnent comme fournisseur SMS.

À ce stade, le fichier `src/lib/supabase.js` est déjà prêt à se connecter — il
suffira de remplacer les tableaux de démo (`PRODUCTS`, `ARTISANS`, etc. dans
`App.jsx`) par de vraies requêtes du type :

```js
const { data } = await supabase.from("products").select("*").eq("is_active", true);
```

C'est le travail principal de l'Étape 1 : brancher chaque écran à sa vraie table.

## 3. Paiements CinetPay (Étape 2)

CinetPay gère les paiements mobile money en Afrique centrale/de l'ouest.

1. Crée un compte marchand sur https://cinetpay.com.
2. Les paiements (abonnement Pro, boost de vues) doivent être initiés depuis un
   **backend** (Supabase Edge Function), jamais depuis le navigateur, pour ne
   pas exposer ta clé API. Une Edge Function Supabase reçoit la demande de
   paiement, appelle l'API CinetPay, puis écoute le webhook de confirmation
   pour mettre à jour la table `payments` et activer l'abonnement dans `pros`.
3. Exemple de commande pour créer l'edge function (une fois Supabase CLI
   installée avec `npm install -g supabase`) :
   ```bash
   supabase functions new cinetpay-webhook
   ```

## 4. Déploiement web (Vercel ou Netlify)

**Vercel** :
```bash
npm install -g vercel
vercel
```
Puis dans les paramètres du projet Vercel, ajoute les mêmes variables que ton
`.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

**Netlify** (alternative) :
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 5. Version Android (Capacitor — Étape 7)

Une fois le site déployé et stable :
```bash
npm install @capacitor/core @capacitor/android
npx cap init "KP AFRIQUE" "com.bureaumamat.kpafrique"
npm run build
npx cap add android
npx cap open android
```
Ça ouvre Android Studio avec le projet prêt à compiler en `.apk`.

## Prochaine étape concrète recommandée

Vu où en est le projet, l'action la plus utile maintenant est l'**Étape 1** :
créer le vrai projet Supabase, exécuter `schema.sql`, et brancher l'écran
"Marché" (`MarketScreen` dans `App.jsx`) à la vraie table `products` avec les
premiers vendeurs pilotes de Kousseri (Bureau MAMAT en premier testeur).
