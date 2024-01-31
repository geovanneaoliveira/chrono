import { TIME_UNIT_DICTIONARY } from "../constants";
import { ParsingContext } from "../../../chrono";
import { ParsingComponents } from "../../../results";
import dayjs from "dayjs";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import { matchAnyPattern } from "../../../utils/pattern";

const PATTERN = new RegExp(
    `(${matchAnyPattern(TIME_UNIT_DICTIONARY)})\\s*(passad[ao]|retrasad[ao]|que vem)(?=\\s*)` + "(?=\\W|$)",
    "i"
);

const RELATIVE_WORD_GROUP = 1;
const MODIFIER_WORD_GROUP = 2;

export default class PTRelativeAfterDateFormatParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(): RegExp {
        return PATTERN;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingComponents {
        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
        const timeunit = TIME_UNIT_DICTIONARY[unitWord];

        if (modifier == "que vem") {
            const timeUnits = {};
            timeUnits[timeunit] = 1;
            return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }

        if (modifier == "passado" || modifier == "passada") {
            const timeUnits = {};
            timeUnits[timeunit] = -1;
            return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }

        if (modifier == "retrasado" || modifier == "retrasada") {
            const timeUnits = {};
            timeUnits[timeunit] = -2;
            return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }

        const components = context.createParsingComponents();
        let date = dayjs(context.reference.instant);

        // This week
        if (unitWord.match(/week/i)) {
            date = date.add(-date.get("d"), "d");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.imply("year", date.year());
        }

        // This month
        else if (unitWord.match(/month/i)) {
            date = date.add(-date.date() + 1, "d");
            components.imply("day", date.date());
            components.assign("year", date.year());
            components.assign("month", date.month() + 1);
        }

        // This year
        else if (unitWord.match(/year/i)) {
            date = date.add(-date.date() + 1, "d");
            date = date.add(-date.month(), "month");

            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.assign("year", date.year());
        }

        return components;
    }
}