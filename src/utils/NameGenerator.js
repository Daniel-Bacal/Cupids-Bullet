import { names } from "./NamesText"
import { randomFrom } from "./MathUtils"

export default class NameGenerator {
    constructor() {}

    generateName() {
        return "" + randomFrom(names) + " " + randomFrom(names);
    }
}