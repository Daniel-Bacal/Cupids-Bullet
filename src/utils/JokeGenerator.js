import { jokes } from "./JokeText"
import { randomFrom } from "./MathUtils"
  
export default class JokeGenerator {
    constructor() {}

    generateJokeTest() {
        return randomFrom(jokes);
    }
}