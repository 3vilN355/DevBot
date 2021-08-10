const {MessageEmbed} = require("discord.js");

exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
        try {
            // Eval the code
            let analysis = scope_analysis(args.join(' '))
            console.log(analysis)
            message.channel.send({embeds: [new MessageEmbed({description: analysis.locations})]})
        } catch (e) {
            client.log('err', e)
        }
    })
};

const OPENING_BRACKETS = ["(", "[", "{"]
const CLOSING_BRACKETS = [")", "]", "}"]
const LITERALS = ["\"", "\'", "\`"]
const SPECIAL_CHAR = "\\"
const LOCATION_HALF_RANGE = 10;

function scope_analysis(code) {
    let string_analysis_results = ""
    let scope_analysis_results = ""
    let extra_closing_brackets = 0

    let scopes = new Array(OPENING_BRACKETS.length).fill(0)
    let opening_bracket_indices = new Array(OPENING_BRACKETS.length).fill([])
    let open = new Array(LITERALS.length)

    let error_locations = []

    let special_char = false
    let open_literal = null

    for (let i = 0; i < code.length; i++) {
        let current_char = code[i]
        if (!special_char && open_literal === null) {
            const openingBracketIndex = OPENING_BRACKETS.indexOf(current_char)
            const closingBracketIndex = CLOSING_BRACKETS.indexOf(current_char)
            if (openingBracketIndex >= 0) {
                opening_bracket_indices[openingBracketIndex].push(i)
                scopes[openingBracketIndex] += 1
            } else if (closingBracketIndex >= 0) {
                scopes[closingBracketIndex] -= 1
                // Also, check if its below 0, if it is there's an error
                if (scopes[closingBracketIndex] < 0) {
                    scopes[closingBracketIndex] = 0;
                    extra_closing_brackets += 1;
                    error_locations.push(i);
                }
            }
        }
        let literalIdx = LITERALS.indexOf(current_char)
        if (literalIdx >= 0 && (!open_literal || current_char === open_literal) && !special_char) {
            if (open[literalIdx] == null) {
                open[literalIdx] = i
                open_literal = LITERALS[literalIdx]
            } else {
                open[literalIdx] = null
                open_literal = null
            }
        }
        special_char = current_char === SPECIAL_CHAR;
    }

    for (let i = 0; i < LITERALS.length; i++) {
        if (open[i] != null) {
            error_locations.push(open[i])
            string_analysis_results += "mismatch on " + LITERALS[i]
        }
    }

    if (extra_closing_brackets > 0) {
        scope_analysis_results += "extra closing brackets: {" + extra_closing_brackets + "} "
    }


    for (let i = 0; i < scopes.length; i++) {
        if (scopes[i] == 0) continue;
        let bracket_type = OPENING_BRACKETS[i] + " or " + CLOSING_BRACKETS[i]
        if (scopes[i] > 0) {
            scope_analysis_results += scopes[i] + " missing " + bracket_type
            for (let j = 0; j < scopes[i]; j++) {
                error_locations.push(opening_bracket_indices[i][j])
            }
        } else {
            scope_analysis_results += -scopes[i] + " extra " + bracket_type
        }
        if (i !== scopes.length - 1) {
            scope_analysis_results += " "
        }
    }


    let error_highlights = []
    for (let i = 0; i < error_locations.length; i++) {
        let error_index = error_locations[i]
        let start_index = Math.max(error_index - LOCATION_HALF_RANGE, 0)
        let end_index = Math.min(error_index + LOCATION_HALF_RANGE, code.length)

        let err_msg = ""
        for (let index = start_index; index < end_index; index++) {
            if (index === error_index) {
                // err_msg += "\x1b[41m" + code[index] + "\x1b[0m"
                err_msg += "**" + code[index] + "**"
            } else {
                err_msg += code[index]
            }
        }
        error_highlights.push(err_msg)
    }

    let all_errors = ""
    for (let i = 0; i < error_highlights.length; i++) {
        all_errors += error_highlights[i] + "\n"
    }

    return {locations: all_errors, scopeResult: scope_analysis_results, stringResult: string_analysis_results}
}

exports.conf = {
    aliases: ['r'],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "test",
    description: `some test shit`,
};