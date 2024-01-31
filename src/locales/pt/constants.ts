import { OpUnitType, QUnitType } from "dayjs";
import { matchAnyPattern, repeatedTimeunitPattern } from "../../utils/pattern";
import { TimeUnits } from "../../utils/timeunits";

export const WEEKDAY_DICTIONARY: { [word: string]: number } = {
    "domingo": 0,
    "dom": 0,
    "segunda": 1,
    "segunda-feira": 1,
    "seg": 1,
    "terça": 2,
    "terça-feira": 2,
    "ter": 2,
    "quarta": 3,
    "quarta-feira": 3,
    "qua": 3,
    "quinta": 4,
    "quinta-feira": 4,
    "qui": 4,
    "sexta": 5,
    "sexta-feira": 5,
    "sex": 5,
    "sábado": 6,
    "sabado": 6,
    "sab": 6,
};

export const FULL_MONTH_NAME_DICTIONARY: { [word: string]: number } = {
    janeiro: 1,
    fevereiro: 2,
    março: 3,
    abril: 4,
    maio: 5,
    junho: 6,
    julho: 7,
    agosto: 8,
    setembro: 9,
    outubro: 10,
    novembro: 11,
    dezembro: 12,
};

export const MONTH_DICTIONARY: { [word: string]: number } = {
    ...FULL_MONTH_NAME_DICTIONARY,
    jan: 1,
    "jan.": 1,
    fev: 2,
    "fev.": 2,
    mar: 3,
    "mar.": 3,
    abr: 4,
    "abr.": 4,
    mai:5,
    "mai.":5,
    jun: 6,
    "jun.": 6,
    jul: 7,
    "jul.": 7,
    ago: 8,
    "ago.": 8,
    set: 9,
    "set.": 9,
    out: 10,
    "out.": 10,
    nov: 11,
    "nov.": 11,
    dez: 12,
    "dez.": 12,
};

export const TIME_UNIT_DICTIONARY_NO_ABBR: { [word: string]: OpUnitType | QUnitType } = {
    segundo: "second",
    segundos: "second",
    minuto: "minute",
    minutos: "minute",
    hora: "hour",
    horas: "hour",
    dia: "d",
    dias: "d",
    semana: "week",
    semanas: "week",
    mes: "month",
    mês: "month",
    meses: "month",
    quarto: "quarter",
    quartos: "quarter",
    ano: "year",
    anos: "year",
};

export const TIME_UNIT_DICTIONARY: { [word: string]: OpUnitType | QUnitType } = {
    seg: "second",
    segundo: "second",
    segundos: "second",
    m: "minute",
    min: "minute",
    mins: "minute",
    minuto: "minute",
    minutos: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hora: "hour",
    horas: "hour",
    d: "d",
    dia: "d",
    dias: "d",
    s: "w",
    sem: "week",
    semana: "week",
    mes: "month",
    mês: "month",
    meses: "month",
    qrt: "quarter",
    quarto: "quarter",
    quartos: "quarter",
    a: "year",
    ano: "year",
    anos: "year",
    // Also, merge the entries from the full-name dictionary.
    // We leave the duplicated entries for readability.
    ...TIME_UNIT_DICTIONARY_NO_ABBR,
};

//-----------------------------
// 88 p. Chr. n.
// 234 AC
export const YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
export function parseYear(match: string): number {
    if (match.match(/^[0-9]{1,4}$/)) {
        let yearNumber = parseInt(match);
        if (yearNumber < 100) {
            if (yearNumber > 50) {
                yearNumber = yearNumber + 1900;
            } else {
                yearNumber = yearNumber + 2000;
            }
        }
        return yearNumber;
    }

    if (match.match(/a\.?\s*c\.?/i)) {
        match = match.replace(/a\.?\s*c\.?/i, "");
        return -parseInt(match);
    }

    return parseInt(match);
}

export const INTEGER_WORD_DICTIONARY: { [word: string]: number } = {
    um: 1,
    dois: 2,
    duas: 2,
    três: 3,
    tres: 3,
    quatro: 4,
    cinco: 5,
    seis: 6,
    sete: 7,
    oito: 8,
    nove: 9,
    dez: 10,
    onze: 11,
    doze: 12,
};

export const NUMBER_PATTERN = `(?:${matchAnyPattern(
    INTEGER_WORD_DICTIONARY
)}|[0-9]+|[0-9]+\\.[0-9]+|mei[ao]|metade(?:\\s{0,2}um?)?|um?\\b(?:\\s{0,2}pouc[ao]s)?|pouc[ao]s|v[aá]ri[oa]s|divers[ao]s|o|a|uma?\\s{0,2}duas\\s{0,2}(?:de)?)`;

const SINGLE_TIME_UNIT_PATTERN = `(${NUMBER_PATTERN})\\s{0,3}(${matchAnyPattern(TIME_UNIT_DICTIONARY)})`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");

export const TIME_UNITS_PATTERN = repeatedTimeunitPattern(
    `(?:(?:cerca de|em torno de)\\s{0,3})?`,
    SINGLE_TIME_UNIT_PATTERN
);
const SINGLE_TIME_UNIT_NO_ABBR_PATTERN = `(${NUMBER_PATTERN})\\s{0,3}(${matchAnyPattern(
    TIME_UNIT_DICTIONARY_NO_ABBR
)})`;
export const TIME_UNITS_NO_ABBR_PATTERN = repeatedTimeunitPattern(
    `(?:(?:cerca de|em torno de)\\s{0,3})?`,
    SINGLE_TIME_UNIT_NO_ABBR_PATTERN
);

export function parseTimeUnits(timeunitText): TimeUnits {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length).trim();
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}

function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}

export function parseNumberPattern(match: string): number {
    const num = match.toLowerCase();
    if (INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return INTEGER_WORD_DICTIONARY[num];
    } else if (num === "um" || num === "uma" || num == "o" || num == "a") {
        return 1;
    } else if (num.match(/pouc[ao]s/)) {
        return 3;
    } else if (num.match(/(meio|metade)/)) {
        return 0.5;
    } else if (num.match(/duas/)) {
        return 2;
    } else if (num.match(/(v[aá]ri[oa]s|divers[ao]s)/)) {
        return 7;
    }

    return parseFloat(num);
}
