const tokenTypes = [
    { regex: /func|print|return|while|if|contenido|none/, type: "PRESERVADAS" },
    { regex: /:|;|"|'/, type: "SIMBOLOS" },
    { regex: /\(|\)/, type: "PARENTESIS" },
    { regex: /{|}/, type: "LLAVES" },
    { regex: /==|and|or|nor/, type: "OPERADOR_LOGICO" },
    { regex: /=/, type: "OPERADOR_ASIGNACION" },
    { regex: /int|string|char|bool|float/, type: "TIPO" },
    { regex: /true|false/, type: "BOOLEANOS" },
    { regex: /\b\d+\b(?![.])/, type: "NUMERICOS" },
    { regex: /\b\d+(\.\d+)?\b/, type: "DECIMALES" },
    { regex: /[a-zA-Z0-9]+/, type: "NOMBRE" },
];

export function lex(input) {
    let tokens = [];
    let position = 0;

    while (input.length > 0) {
        const whitespace = input.match(/^\s+/);
        if (whitespace) {
            position += whitespace[0].length;
            input = input.slice(whitespace[0].length);
        }

        if (input.length === 0) {
            break;
        }

        let match = false;
        for (let tokenType of tokenTypes) {
            const result = tokenType.regex.exec(input);
            if (result !== null) {
                match = true;
                tokens.push({ type: tokenType.token, value: result[0] });
                position += result[0].length;
                input = input.slice(result[0].length);
                break;
            }
        }

        if (!match) {
            const errorToken = input[0];
            tokens.push({ type: "UNKNOWN", value: `Carácter inesperado '${errorToken}' en la posición ${position}.` });
            break;
        }
    }

    return tokens;
}


