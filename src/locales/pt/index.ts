/**
 * Chrono components for Portuguese support (*parsers*, *refiners*, and *configuration*)
 *
 * @module
 */

import { includeCommonConfiguration } from "../../configurations";
import { Chrono, Configuration, Parser, Refiner } from "../../chrono";
import { ParsingResult, ParsingComponents, ReferenceWithTimezone } from "../../results";
import { Component, ParsedResult, ParsingOption, ParsingReference, Meridiem, Weekday } from "../../types";
import SlashDateFormatParser from "../../common/parsers/SlashDateFormatParser";
import PTWeekdayParser from "./parsers/PTWeekdayParser";
import PTTimeExpressionParser from "./parsers/PTTimeExpressionParser";
import PTMergeDateTimeRefiner from "./refiners/PTMergeDateTimeRefiner";
import PTMergeDateRangeRefiner from "./refiners/PTMergeDateRangeRefiner";
import PTMonthNameLittleEndianParser from "./parsers/PTMonthNameLittleEndianParser";
import PTCasualDateParser from "./parsers/PTCasualDateParser";
import PTCasualTimeParser from "./parsers/PTCasualTimeParser";
import PTRelativeDateFormatParser from "./parsers/PTRelativeDateFormatParser";
import PTTimeUnitCasualRelativeFormatParser from "./parsers/PTTimeUnitCasualRelativeFormatParser";
import PTTimeUnitAgoFormatParser from "./parsers/PTTimeUnitAgoFormatParser";
import PTSlashMonthFormatParser from "./parsers/PTSlashMonthFormatParser";
import PTRelativeAfterDateFormatParser from "./parsers/PTRelativeAfterDateFormatParser";
import PTMergeRelativeDateRefiner from "./refiners/PTMergeRelativeDateRefiner";
import PTMonthNameParser from "./parsers/PTMonthNameParser";

export { Chrono, Parser, Refiner, ParsingResult, ParsingComponents, ReferenceWithTimezone };
export { Component, ParsedResult, ParsingOption, ParsingReference, Meridiem, Weekday };

// Shortcuts
export const casual = new Chrono(createCasualConfiguration());
export const strict = new Chrono(createConfiguration(true));

export function parse(text: string, ref?: ParsingReference | Date, option?: ParsingOption): ParsedResult[] {
    return casual.parse(text, ref, option);
}

export function parseDate(text: string, ref?: ParsingReference | Date, option?: ParsingOption): Date {
    return casual.parseDate(text, ref, option);
}

/**
 * @ignore (to be documented later)
 */
export function createCasualConfiguration(littleEndian = true): Configuration {
    const option = createConfiguration(false, littleEndian);
    option.parsers.push(new PTCasualDateParser());
    option.parsers.push(new PTCasualTimeParser());
    option.parsers.push(new PTRelativeDateFormatParser());
    option.parsers.push(new PTRelativeAfterDateFormatParser());
    option.parsers.push(new PTTimeUnitCasualRelativeFormatParser());
    option.parsers.unshift(new PTMonthNameParser());
    return option;
}

/**
 * @ignore (to be documented later)
 */
export function createConfiguration(strictMode = true, littleEndian = true): Configuration {
    return includeCommonConfiguration(
        {
            parsers: [
                new SlashDateFormatParser(littleEndian),
                new PTWeekdayParser(),
                new PTTimeExpressionParser(),
                new PTMonthNameLittleEndianParser(),
                new PTTimeUnitCasualRelativeFormatParser(),
                new PTSlashMonthFormatParser(),
                new PTTimeUnitAgoFormatParser(strictMode),
            ],
            refiners: [new PTMergeDateTimeRefiner(), new PTMergeDateRangeRefiner(), new PTMergeRelativeDateRefiner()],
        },
        strictMode
    );
}
