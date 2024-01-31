import { TIME_UNITS_PATTERN, parseTimeUnits, TIME_UNITS_NO_ABBR_PATTERN } from "../constants";
import { ParsingContext } from "../../../chrono";
import { ParsingComponents } from "../../../results";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import { reverseTimeUnits } from "../../../utils/timeunits";

const PATTERN = new RegExp(`(es[st][ea]s|[úu]ltim[oa]s|pr[óo]xim[oa]s|\\+|-)\\s*(${TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
const PATTERN_NO_ABBR = new RegExp(
    `(es[st][ea]s|[úu]ltim[oa]s|pr[óo]xim[oa]s|\\+|-)\\s*(${TIME_UNITS_NO_ABBR_PATTERN})(?=\\W|$)`,
    "i"
);

export default class PTTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundaryChecking {
    constructor(private allowAbbreviations: boolean = true) {
        super();
    }

    innerPattern(): RegExp {
        return this.allowAbbreviations ? PATTERN : PATTERN_NO_ABBR;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingComponents {
        const prefix = match[1].toLowerCase();
        let timeUnits = parseTimeUnits(match[2]);
        switch (prefix) {
            case "ultimos":
            case "ultimas":
            case "últimos":
            case "últimas":
            case "-":
                timeUnits = reverseTimeUnits(timeUnits);
                break;
        }

        return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
}
