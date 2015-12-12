const MARS_MASS = 0.107; // of Earth mass
const MIN_DIFF = 1e-6;

export default class {
  constructor(star, planet, habitationZone) {
    this.star = star;
    this.planet = planet;
    this.habitationZone = habitationZone;

    this.orbitCheckDone = false;

    this.orbitMaxDist = -Infinity;
    this.orbitMinDist = Infinity;
    this.prevDist = null;
    this.trends = [];
  }

  get output() {
    if (!this.orbitCheckDone) return null;
    let star = this.star;
    let planet = this.planet;
    let hz = this.habitationZone;
    let orbitMaxDist = this.orbitMaxDist;
    let orbitMinDist = this.orbitMinDist;
    return {
      starType: star.type !== 'A' && star.type !== 'M',
      planetType: planet.rocky,
      planetSize: planet.diameter > Math.pow(4 * MARS_MASS, 0.3333),
      orbitalDistance: orbitMinDist > hz.innerRadius && orbitMaxDist < hz.outerRadius
    };
  }

  addPlanetPos(x, y) {
    let dist = distance(x, y);
    this.orbitMaxDist = Math.max(dist, this.orbitMaxDist);
    this.orbitMinDist = Math.min(dist, this.orbitMinDist);

    if (this.prevDist !== null) {
      if (dist > this.prevDist && this.trends[0] !== '+') {
        this.trends.unshift('+');
      } else if (dist < this.prevDist && this.trends[0] !== '-') {
        this.trends.unshift('-');
      }

      // Possible cases: ['+', '-', '+'] or ['-', '+', '-']
      // When we have observed three different trends (planet moving towards or away from star),
      // it means that the planed have done the full orbit around the star.
      if (this.trends.length >= 3) {
        this.orbitCheckDone = true;
      }
    }

    this.prevDist = dist;
  }
}

function distance(x, y) {
  return Math.sqrt(x * x + y * y);
}
