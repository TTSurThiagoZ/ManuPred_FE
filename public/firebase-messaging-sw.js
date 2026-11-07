// Service worker do Firebase Cloud Messaging — registrado no main.jsx em /firebase-messaging-sw.js.
// Recebe as notificações push do Firebase. Troque as chaves abaixo pelas do seu projeto no console do Firebase.

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBVq1Yg1i5A2M8qt9xUIqHsfSy3b_omHvw",
  authDomain: "kipper-56bb0.firebaseapp.com",
  projectId: "kipper-56bb0",
  storageBucket: "kipper-56bb0.firebasestorage.app",
  messagingSenderId: "355480871385", // é o número que aparece no appId (1:355480871385:web:...)
  appId: "1:355480871385:web:b4e343f1673306c499f9c8",
});

const messaging = firebase.messaging();

// Mensagem que chega com o site fechado ou em segundo plano.
// Se ela já vier com "notification", o próprio Firebase mostra; aqui tratamos só as que vêm em "data".
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const { title, body } = payload.data || {};
  if (!title) return;
  self.registration.showNotification(title, { body, icon: '/kipper-logo.svg' });
});
