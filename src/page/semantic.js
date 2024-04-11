export function analyzeSemantics(ast) {
    let errors = [];
    let variablesStatus = new Map(); 
    let functionsStatus = new Map();

    ast.forEach(statement => {
        if (statement.type.startsWith("Declaration")) {
            statement.variables.forEach(varDecl => {
                const variable = varDecl.identifier;
                if (variablesStatus.has(variable)) {
                    errors.push(`Error Semántico: Variable duplicada '${variable}'`);
                } else {
                    variablesStatus.set(variable, { 
                        initialized: varDecl.initialized, 
                        read: false, 
                        type: statement.type.replace("Declaration", "").toLowerCase() 
                    });
                }
            });
        }
        else if (statement.type === "While") {
            const variable = statement.variable;
            const variableStatus = variablesStatus.get(variable);
            
            if (!variableStatus) {
                errors.push(`Error Semántico: Variable no declarada '${variable}' usada en la condición while`);
            } else {
                if (variableStatus.type !== "bool") {
                    errors.push(`Error Semántico: Variable '${variable}' usada en la condición while no es de tipo bool`);
                } else if (!variableStatus.initialized && !variableStatus.read) {
                    errors.push(`Error Semántico: Variable bool '${variable}' no inicializada usada en la condición while`);
                }
            }
        }
        
        else if (statement.type === "Print") {
            const variable = statement.variable;
            const status = variablesStatus.get(variable);
            if (!status) {
                errors.push(`Error Semántico: Variable del print no declarada '${variable}' `);
            } else if (!status.initialized && !status.read) {
                errors.push(`Error Semántico: Variable del print '${variable}' no inicializada `);
            }
        } else if (statement.type === "Function") {
            const functionName = statement.identifier;
            if (functionsStatus.has(functionName)) {
                errors.push(`Error Semántico: Nombre de función duplicado '${functionName}'`);
            } else {
                functionsStatus.set(functionName, true); 
                
                
            }
        } else if (statement.type === "Switch") {
            const switchVariable = statement.variable;        
            if (!variablesStatus.has(switchVariable)) {
                errors.push(`Error Semántico: Variable no declarada '${switchVariable}' usada en switch`);
            }
        }
    });

    return { errors, variablesStatus };
}