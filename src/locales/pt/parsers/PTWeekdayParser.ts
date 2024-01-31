import { ParsingContext } from "../../../chrono";
import { ParsingComponents } from "../../../results";
import { WEEKDAY_DICTIONARY } from "../constants";
import { matchAnyPattern } from "../../../utils/pattern";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import { createParsingComponentsAtWeekday } from "../../../common/calculation/weekdays";

const PATTERN = new RegExp(
    "(?:(?:\\,|\\(|\\（)\\s*)?" +
        "(?:n[oa]\\s*?)?" +
        "(?:(es[st]e|es[st]a|passad[oa]|pr[oó]xim[oa])\\s*)?" +
        `(${matchAnyPattern(WEEKDAY_DICTIONARY)})` +
        "(?:\\s*(?:\\,|\\)|\\）))?" +
        "(?:\\s*(es[st]e|es[st]a|passad[oa]|pr[óo]ximo)\\s*semana)?" +
        "(?=\\W|$)",
    "i"
);

// TODO

const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;

export default class PTWeekdayParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(): RegExp {
        return PATTERN;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingComponents {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const weekday = WEEKDAY_DICTIONARY[dayOfWeek];
        if (weekday === undefined) {
            return null;
        }

        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let norm = prefix || postfix || "";
        norm = norm.toLowerCase();

        let modifier = null;
        if (norm == "passado" || "passada") {
            modifier = "last";
        } else if (norm == "próximo" || norm == "proximo") {
            modifier = "next";
        } else if (norm == "este" || norm == "esse" || norm == "esta" || norm == "essa") {
            modifier = "this";
        }

        return createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    }
}
