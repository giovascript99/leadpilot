/**
 * ============================================================
 *  CONFIGURAZIONE PROSPECT — per cambiare settore della demo
 *  basta cambiare il preset importato qui sotto (una riga).
 *  Dopo il cambio: `npm run demo:reset` per riallineare i dati.
 *
 *  Preset disponibili in config/presets/:
 *    - edilizia     (impresa di ristrutturazioni)
 *    - immobiliare  (agenzia immobiliare — target outreach)
 *
 *  Per un prospect specifico: duplica un preset, personalizza
 *  i campi e importalo qui.
 * ============================================================
 */
import { immobiliare } from "./presets/immobiliare";

export type { BusinessConfig } from "./types";

export const businessConfig = immobiliare;
