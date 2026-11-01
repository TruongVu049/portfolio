/**
 * Hero entrance choreography, in three acts:
 *   1. The name: sky, stars and copy only, while the signature is written.
 *   2. The world: once the signature is done, the scene arrives piece by piece.
 *   3. Accents: rocket and shooting stars, only after everything has settled.
 *
 * Act 2 and 3 values are seconds after the signature completes (`introDone`).
 */
export const SCENE_DELAY = {
  horizon: 0,
  terminal: 0.25,
  planet: 0.4,
  satellite: 0.55,
  astronaut: 0.7,
  cornerMeta: 0.9,
  scrollBadge: 1,
  rocket: 3.3,
}

/**
 * Shooting stars run on their own clock from page load (seconds), starting after
 * the signature (~2.7s) and the scene (~4.5s) have both finished.
 */
export const SHOOTING_STAR_DELAY = [8, 12, 17]

export const SCENE_EASE = [0.22, 1, 0.36, 1]
