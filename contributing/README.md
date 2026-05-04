required dependencies

npm
npm install -g pnpm firebase-tools

pnpm install

firebase login // con cuenta grupo.quatro.ort@gmail.com

verfiicar que anda

pnpm install

pnpm audit --fix // corregir dependencias desactualizadas

pnpm turbo run build --filter=@ats/functions // compilar funciones

pnpm turbo run dev --filter=@ats/web //levantar next.js en dev

firebase init emulators //correr emuladores de firebase
firebase emulators:start
