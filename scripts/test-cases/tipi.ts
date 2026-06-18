/** Caso di collaudo per npm run test:leads. */
export interface CasoTest {
  etichetta: string;
  atteso: string;
  nome: string;
  email: string;
  telefono?: string;
  messaggio: string;
}
