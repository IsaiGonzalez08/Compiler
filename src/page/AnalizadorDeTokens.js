export function handleValidateChange(
  codigo,
  setCurrentCode,
  validateGrammar,
  setValidationGrammar,
  setIsFound,
  setResult,
  setErrorMessage,

) {
  setCurrentCode(codigo);
  checkCode(codigo, setIsFound, setResult, setErrorMessage);
  const grammar = validateGrammar(codigo);
  setValidationGrammar(grammar);
}

export const checkCode = (
  codigo,
  setIsFound,
  setResult,
  setErrorMessage,
) => {
  const lexer = new Lexer(codigo);
  let tokens = [];
  let error = null;

  try {
    let token = lexer.getNextToken();
    while (token.type !== "FINAL") {
      tokens.push(token);
      token = lexer.getNextToken();
    }
    setIsFound(true);
  } catch (err) {
    setIsFound(false);
    error = `Error en la posición ${lexer.position}: ${err.message}`;
  }

  setResult(tokens.map((token) => `${token.type}: ${token.value}`));
  setErrorMessage(error);
};

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokenTable = [
      { regex: /func|return|while|if|contenido|none/, type: "PRESERVADAS" },
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
  }

  getNextToken() {
    while (this.position < this.input.length) {
      let char = this.input[this.position];
      for (const tokenDef of this.tokenTable) {
        const match = this.input.slice(this.position).match(tokenDef.regex);
        if (match && match.index === 0) {
          this.position += match[0].length;
          return { type: tokenDef.type, value: match[0] };
        }
      }
      if (/\s/.test(char)) {
        this.position++;
        continue;
      }
      throw new Error(`Caracter inesperado: ${char}`);
    }
    return { type: "FINAL", value: null };
  }
}
