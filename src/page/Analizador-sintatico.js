import * as grammar from "./gramatica";

export function validateGrammar(input) {
    console.log("Input before lexing:", input); 
  
    try {
      if(!input.length) return 
      const result = grammar.parse(input);
  
      return {
        success: true,
        message: 'Cadena válida',
        result: result
      };
    } catch (error) {
      console.error("Parsing Error:", error); 
  
      return {
        success: false,
        message: `Error al analizar la cadena de texto: ${error.message}`,
      };
    }
  }