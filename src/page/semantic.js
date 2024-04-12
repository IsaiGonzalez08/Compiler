export function analyzeSemantics(ast) {
    let errors = [];
    let variablesStatus = new Map();
    let functionsStatus = new Map();

    function validateFunctionBody(body, functionParam) {
        body.forEach(innerNode => {
            if (innerNode.type.startsWith("Declaration")) {
                validateVariableDeclarations(innerNode.variables);
            } else if (innerNode.type === "Print") {
                if (innerNode.variable !== functionParam) {
                    errors.push(`Error Semántico: El argumento del print dentro de la función debe ser igual al parámetro de la función`);
                }
            }
        });
    }

    function validateFunctionDeclarations(functionNode) {
        const functionName = functionNode.identifier;

        if (functionsStatus.has(functionName)) {
            errors.push(`Error Semántico: Nombre de función duplicado '${functionName}'`);
        } else {
            functionsStatus.set(functionName, true);
        }

        const functionParam = functionNode.variable;
        if (!variablesStatus.has(functionParam)) {
            errors.push(`Error Semántico: Parámetro de función '${functionParam}' no declarado`);
        }

        // Validar el argumento del print
        validateFunctionBody(functionNode.body, functionParam);
    }

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
        else if (statement.type === "WhileVariable") {
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
        else if (statement.type === "WhileCondition") {
            const variable = statement.variable;
            if (!variablesStatus.has(variable)) {
                errors.push(`Error semántico: La variable '${variable}' en la condición del WhileCondition no está declarada`);
            } else {
                const variableType = variablesStatus.get(variable).type;
                if (variableType !== "bool") {
                    errors.push(`Error semántico: La variable '${variable}' en la condición del WhileCondition debe ser de tipo booleano`);
                } else if (!variablesStatus.get(variable).initialized) {
                    errors.push(`Error semántico: La variable '${variable}' en la condición del WhileCondition no está inicializada`);
                }
            }
            const condition = statement.condition;
            if (condition.type !== "Condition") {
                errors.push("Error semántico: La condición del WhileCondition debe ser una comparación");
            } else {
                const conditionVariable = condition.variable;
                if (!variablesStatus.has(conditionVariable)) {
                    errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del WhileCondition no está declarada`);
                } else {
                    const conditionVariableType = variablesStatus.get(conditionVariable).type;
                    if (conditionVariableType !== "bool") {
                        errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del WhileCondition debe ser de tipo booleano`);
                    } else if (!variablesStatus.get(conditionVariable).initialized) {
                        errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del WhileCondition no está inicializada`);
                    }
                }
            }
        }

        else if (statement.type === "If") {
            const conditionVariable = statement.variable;
            if (!variablesStatus.has(conditionVariable)) {
                errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del If no está declarada`);
            } else {
                const conditionVariableType = variablesStatus.get(conditionVariable).type;
                if (conditionVariableType !== "bool") {
                    errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del If debe ser de tipo booleano`);
                } else if (!variablesStatus.get(conditionVariable).initialized) {
                    errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del If no está inicializada`);
                }
            }
        }
        else if (statement.type === "IfCondition") {
            const conditionVariable = statement.variable;
            if (!variablesStatus.has(conditionVariable)) {
                errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del IfCondition no está declarada`);
            } else {
                const conditionVariableType = variablesStatus.get(conditionVariable).type;
                if (conditionVariableType !== "bool") {
                    errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del IfCondition debe ser de tipo booleano`);
                } else if (!variablesStatus.get(conditionVariable).initialized) {
                    errors.push(`Error semántico: La variable '${conditionVariable}' en la condición del IfCondition no está inicializada`);
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
        }
        else if (statement.type === "Function") {
            const functionName = statement.identifier;
            const functionParam = statement.variable;
            const printArgument = statement.print.variable;
            const returnId = statement.returnid;
        
            if (functionsStatus.has(functionName)) {
                errors.push(`Error Semántico: Nombre de función duplicado '${functionName}'`);
            } else {
                functionsStatus.set(functionName, functionParam);
            }
        
            if (!variablesStatus.has(functionParam)) {
                errors.push(`Error Semántico: Parámetro de función '${functionParam}' no declarado`);
            }
        
            if (printArgument !== functionParam) {
                errors.push(`Error Semántico: El argumento del print en la función '${functionName}' debe ser igual al parámetro de la función`);
            }
            if (returnId !== functionParam) {
                errors.push(`Error Semántico: El valor de retorno '${returnId}' en la función '${functionName}' debe ser igual al parámetro de la función`);
            }
        }
    });

    return { errors, variablesStatus };
}
