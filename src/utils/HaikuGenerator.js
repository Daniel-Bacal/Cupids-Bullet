import { randIntFrom, randomFrom } from "./MathUtils"
import { nouns, verbs, adjs, wordTypes } from "./HaikuText"

export default class HaikuGenerator{
    generateHaikuTest() {
        let choice = randIntFrom(0, 2);

        // Penalty for being incorrect is 2x benefit from being correct

        let haikuMaybe;

        if (choice === 0) {
            haikuMaybe = this.generateHaiku();
        } else {
            haikuMaybe = this.generateNotHaiku();
        }

        return { haiku: haikuMaybe, isHaiku: choice === 1 ? false : true };
    }

    generateHaiku() {
        return this.generateHaikuMaybe(5, 7, 5);
    }

    generateHaikuMaybe(l1, l2, l3) {
        // 5 7 5

        let choice;
        let count;

        // Line 1
        let line1 = "";
        count = l1;
        choice = randIntFrom(0, 6);
        if (choice === 0) {
            line1 += "the";
            count--;
        } else if (choice === 1) {
            line1 += "why";
            count--;
        }

        line1 += this.generateLine(count);

        // Line 2
        let line2 = "";
        count = l2;
        choice = randIntFrom(0, 6);
        if (choice === 0) {
            line2 += "an";
            count--;
        } else if (choice === 1) {
            line2 += "why";
            count--;
        }

        line2 += this.generateLine(count);

        line2 = this.correctAn(line2);

        // Line 3
        let line3 = "";
        count = l3;
        choice = randIntFrom(0, 6);
        if (choice === 0) {
            line3 += "";
            //count--;
        }
        line3 += this.generateLine(count);

        line1 = this.cleanLine(line1);
        line2 = this.cleanLine(line2);
        line3 = this.cleanLine(line3);

        return line1 + "\n\n" + line2 + "\n\n" + line3;
    }

    correctAn(line) {
        if (line.substring(0, 2).includes("an")) {
            if ("qwrtpsdfghjklzxcvbnmy".includes(line.charAt(3))) {
                line = line.substring(0, 1) + line.substring(2);
            }
        }

        return line;
    }

    cleanLine(line) {
        if (line.charAt(0) === " ") {
            line = line.substring(1);
        }

        if (line.includes("why")) {
            line = line + "?";
        }

        line = line.charAt(0).toUpperCase() + line.substring(1);

        return line;
    }

    generateRandomLine(size) {
        let line = "";

        while (size > 0) {
            let wordType = randomFrom(wordTypes);

            let numSyllables = randIntFrom(1, Math.min(wordType.length, size) + 1);

            let randomWord = randomFrom(wordType[numSyllables - 1]);

            line += " " + randomWord;

            size -= numSyllables;
        }
        return line;
    }

    generateLine(size) {
        let line = "";

        let wasVerb = false;
        let wasNoun = false;
        let wasAdj = false;

        while (size > 0) {
            let wordType = randomFrom(wordTypes);

            if (wasNoun) {
                wordType = adjs;
            } else if (wasAdj) {
                wordType = nouns;
            } else {
                let choice = randIntFrom(0, 1);
                if (choice === 0) {
                    wordType = nouns;
                } else {
                    wordType = adjs;
                }
            }

            let numSyllables = randIntFrom(1, Math.min(wordType.length, size) + 1);

            let randomWord = randomFrom(wordType[numSyllables - 1]);

            line += " " + randomWord;

            size -= numSyllables;

            if (wordType === adjs) {
                wasAdj = true;
                wasNoun = false;
                wasVerb = false;
            } else if (wordType === nouns) {
                wasAdj = false;
                wasNoun = true;
                wasVerb = false;
            } else {
                wasAdj = false;
                wasNoun = false;
                wasVerb = true;
            }
        }
        return line;
    }

    generateNotHaiku() {
        // 4 7 5, 5 6 6, 5 6 5, 5 7 4, 6 6 5
        let choice = Math.floor(Math.random() * 4);
        switch (choice) {
        case 0:
            return this.generateHaikuMaybe(4, 7, 5);
        case 1:
            return this.generateHaikuMaybe(5, 6, 6);
        case 2:
            return this.generateHaikuMaybe(5, 6, 5);
        case 3:
            return this.generateHaikuMaybe(5, 7, 4);
        case 4:
            return this.generateHaikuMaybe(6, 6, 5);
        default:
            return "This is an error\nYou should not be seeing this\nThe haiku has failed";
        }
    }
}