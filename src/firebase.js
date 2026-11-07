// Firebase do app (notificações push com Firebase Cloud Messaging).
// Usado pelo Layout depois do login: pede permissão de notificação e gera o token FCM do navegador.
// A mesma configuração precisa estar no public/firebase-messaging-sw.js (o service worker não lê este arquivo).

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyBVq1Yg1i5A2M8qt9xUIqHsfSy3b_omHvw",
  authDomain: "kipper-56bb0.firebaseapp.com",
  projectId: "kipper-56bb0",
  storageBucket: "kipper-56bb0.firebasestorage.app",
  messagingSenderId: "355480871385",
  appId: "1:355480871385:web:b4e343f1673306c499f9c8",
};

// Chave VAPID: Console do Firebase > Configurações do projeto > Cloud Messaging > Certificados push da Web.
// Se ficar vazia, o Firebase tenta usar a chave padrão do projeto.
const VAPID_KEY = "";

export const app = initializeApp(firebaseConfig);

// Pede permissão, registra o service worker e devolve o token FCM (ou null se não der).
export async function ativarNotificacoes() {
  try {
    // Alguns navegadores (ou http sem localhost) não suportam push
    if (!("serviceWorker" in navigator) || !(await isSupported())) {
      console.warn("Firebase Messaging não é suportado neste navegador.");
      return null;
    }

    const permissao = await Notification.requestPermission();
    if (permissao !== "granted") {
      console.warn("Permissão de notificação negada.");
      return null;
    }

    // Mesmo arquivo que o main.jsx registra (se já estiver registrado, o navegador reaproveita)
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      ...(VAPID_KEY ? { vapidKey: VAPID_KEY } : {}),
      serviceWorkerRegistration: registration,
    });

    // Notificação que chega com o site aberto (com o site fechado, quem mostra é o service worker)
    onMessage(messaging, (payload) => {
      console.log("Notificação recebida:", payload);
      const { title, body } = payload.notification || {};
      if (title) new Notification(title, { body, icon: "/kipper-logo.svg" });
    });

    localStorage.setItem("fcmToken", token);
    console.log("Token FCM:", token);
    return token;
  } catch (error) {
    console.error("Erro ao ativar notificações do Firebase:", error);
    return null;
  }
}
