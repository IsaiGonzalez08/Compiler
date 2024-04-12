export function compile(ast, variablesStatus) {
    let compiledCode = "";
    const compileCondition = (condition) => {
        let value;
        if (condition.value.type === "BoolValue") {
            value = condition.value.value;
        } else if (condition.value.type === "CharValue") {
            value = '${condition.value.value}';
        } else {
            value = condition.value;
        }
        let operator = "===";
        return `'${condition.variable} ${operator} ${value}'`;
    };

    

    ast.forEach(node => {
        if (node.type.startsWith("Declaration")) {
            node.variables.forEach(varDecl => {
                let varInit = `let ${varDecl.identifier}`;
                let type = node.type.replace("Declaration", "").toLowerCase();
                variablesStatus[varDecl.identifier] = { type: type, value: varDecl.initialized ? varDecl.value : undefined };

                if (varDecl.initialized) {
                    let value = varDecl.value;
                    if (typeof value === "object" && value.type === "BoolValue") {
                        value = value.value;
                    } else if (typeof value === "string") {
                        value = `'${value}'`; 
                    } else if (typeof value === "object" && value.type === "CharValue") {
                        value = `'${value.value}'`;
                    }

                    varInit += ` = ${value}`;
                }
                compiledCode += `${varInit};\n`;
            });
        } else if (node.type === "Print") {
            const varStatus = variablesStatus[node.variable];
            if (varStatus && varStatus.initialized) {
                let valueToPrint = varStatus.value;
                if (typeof valueToPrint === "object" && valueToPrint.type === "BoolValue") {
                    valueToPrint = valueToPrint.value;
                } else if (typeof valueToPrint === "string") {
                    valueToPrint = "${valueToPrint}";
                } else if (typeof valueToPrint === "object" && valueToPrint.type === "CharValue") {
                    valueToPrint = '${valueToPrint.value}';
                }
                compiledCode += `console.log(${valueToPrint});\n`;
            } else {
                compiledCode += `console.log(${node.variable});\n`;
            }


        }
        else if (node.type === "If") {
            compiledCode += `if (${node.variable}) {\n`;
            node.body.forEach(innerNode => {
                compiledCode += `  ${compile([innerNode], variablesStatus)}\n`;
            });
            compiledCode += `}\n`;
        }
        else if (node.type === "IfCondition") {
            
            compiledCode += `if (${node.variable} ${node.condition.operador.operador} ${node.condition.variable}) {\n`;
            
            node.body.forEach(innerNode => {
                compiledCode += `  ${compile([innerNode], variablesStatus)}\n`;
            });
            
            compiledCode += `}\n`;
        }
        
        else if (node.type === "WhileVariable" || node.type === "WhileCondition") {
            const conditionStatus = variablesStatus[node.variable];
            if (!conditionStatus || conditionStatus.type !== "bool") {
                throw new Error(`Error de compilación: La variable del 'while' debe ser de tipo booleano`);
            }
            compiledCode += `let loopCount = 0;\n`;
            if (node.type === "WhileVariable") {
                compiledCode += `while (${node.variable}) {\n`;
            } 
                else if (node.type === "WhileCondition") {
                    compiledCode += `while (${node.variable} ${node.condition.operador.operador} ${node.condition.variable}) {\n`;
                }
                
            compiledCode += `  if (loopCount >= 1) break;\n`;
            node.body.forEach(innerNode => {
                compiledCode += `  ${compile([innerNode], variablesStatus)}\n`;
            });
            
            compiledCode += `  loopCount++;\n`;
            compiledCode += `}\n`;
        }
        else if (node.type === "Function") {
        
                compiledCode += `function ${node.identifier}(${node.variable}) {\n`;
                compiledCode += `  console.log(${node.print.variable});\n`;
                compiledCode += `  return ${node.returnid};\n`;
                compiledCode += `}\n`;
                compiledCode += `${node.identifier}(${node.variable})\n`;
            
        
        }
        
        
        
    });
    return compiledCode;
}