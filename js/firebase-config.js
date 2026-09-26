/* ==========================================================================
   CONFIGURAÇÃO DO FIREBASE (login e cadastro de clientes)
   ==========================================================================
   Cole aqui o bloco "firebaseConfig" que aparece no console do Firebase em
   Configurações do projeto › Seus apps › App da Web.

   Pode deixar esses valores no código sem medo: eles são públicos por
   natureza. Quem protege os dados dos clientes são as regras de segurança
   do arquivo firestore.rules (publicadas no console do Firebase).

   Se voltar para null, o site funciona como antes: sem login, e o
   agendamento vai direto para o WhatsApp.
   ========================================================================== */

window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyAQK3g8zzmGCr1mks255mGOu_2JNS3ncPY",
    authDomain: "pet-da-pri.firebaseapp.com",
    projectId: "pet-da-pri",
    storageBucket: "pet-da-pri.firebasestorage.app",
    messagingSenderId: "946766176151",
    appId: "1:946766176151:web:bc6256e6b8d8bf7a9feed2",
};

/* Exemplo de como fica depois de preenchido:

window.FIREBASE_CONFIG = {
    apiKey: "AIza...",
    authDomain: "pet-da-pri.firebaseapp.com",
    projectId: "pet-da-pri",
    storageBucket: "pet-da-pri.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123",
};

*/
