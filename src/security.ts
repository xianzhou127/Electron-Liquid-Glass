import type { Role } from './demo-api';
export function trustedPage(url:string, role:Role, mainFrame:boolean) {
  return mainFrame && url === `glass://app/glass.html?role=${role}`;
}
