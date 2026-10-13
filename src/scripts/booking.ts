/* Fenêtre de réservation du diagnostic : construite en phase 3. En attendant, le lien mène à la page Diagnostic. */
export function openBooking(a: HTMLAnchorElement): void {
  location.href = a.href;
}
