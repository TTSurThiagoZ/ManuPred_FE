import { apiClient } from "./apiClient";

const BASE = "/api/v1/users";

/**
 * @typedef {Object} UserResponseDTO
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} email
 * @property {string} firebaseUid
 * @property {string} createdAt - data ISO
 */

/**
 * @typedef {Object} CreateUserRequestDTO
 * @property {string} name - 2 a 100 caracteres
 * @property {string} email
 * @property {string} password - mínimo 6 caracteres
 * @property {string} [firebaseUid]
 */

/** Lista todos os usuários. @returns {Promise<UserResponseDTO[]>} */
export function getAllUsers() {
  return apiClient.get(BASE);
}

/** Busca um usuário pelo ID. @param {string} id @returns {Promise<UserResponseDTO>} */
export function getUserById(id) {
  return apiClient.get(`${BASE}/${id}`);
}

/** Cria um novo usuário. @param {CreateUserRequestDTO} data @returns {Promise<UserResponseDTO>} */
export function createUser({ name, email, password, firebaseUid }) {
  return apiClient.post(BASE, { name, email, password, firebaseUid });
}

/** Autentica com um token do Firebase e recebe o usuário correspondente. @param {string} firebaseToken @returns {Promise<UserResponseDTO>} */
export function authenticateWithFirebase(firebaseToken) {
  return apiClient.post(`${BASE}/auth/firebase`, { token: firebaseToken });
}

/** Remove um usuário. @param {string} id @returns {Promise<void>} */
export function deleteUser(id) {
  return apiClient.delete(`${BASE}/${id}`);
}