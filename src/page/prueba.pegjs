Start
  = Program

Program
  = Statement*

Statement
  = Declaration

  /While
  /Print
  

Declaration
  = IntDeclaration
  / StringDeclaration
  / BoolDeclaration
  / FloatDeclaration
  / CharDeclaration


IntDeclaration
  = "int" _ decl:DeclarationInt _ ";" _ {
      return decl;
    }

StringDeclaration
  = "string" _ decl:DeclarationString _ ";" _ {
      return decl;
    }

BoolDeclaration
  = "bool" _ decl:DeclarationBool _ ";" _ {
      return decl;
    }

FloatDeclaration
  = "float" _ decl:DeclarationFloat _ ";" _ {
      return decl;
    }

CharDeclaration
  = "char" _ decl:DeclarationChar _ ";" _ {
    return decl;
  }

DeclarationInt
  = head:IntVarDecl tail:(_ "," _ IntVarDecl)* {
      return {
        type: "DeclarationInt",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

DeclarationChar
  = head:CharVarDecl tail:(_ "," _ CharVarDecl)* {
      return {
        type: "DeclarationChar",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

DeclarationString
  = head:StringVarDecl tail:(_ "," _ StringVarDecl)* {
      return {
        type: "DeclarationString",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

DeclarationBool
  = head:BoolVarDecl tail:(_ "," _ BoolVarDecl)* {
      return {
        type: "DeclarationBool",
        variables: [head, ...tail.map(item => item[3])]
      };
    }



DeclarationFloat
  = head:FloatVarDecl tail:(_ "," _ FloatVarDecl)* {
      return {
        type: "DeclarationFloat",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

IntVarDecl
  = id:Identifier _ "=" _ val:Integer {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

StringVarDecl
  = id:Identifier _ "=" _ val:Message {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

BoolVarDecl
  = id:Identifier _ "=" _ val:Value {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

FloatVarDecl
  = id:Identifier _ "=" _ val:Float {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }


CharVarDecl
  = id:Identifier _ "=" _ val:Char {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

Print
  = "print" _ "(" variable:Identifier ")" _  ";" _{
      return {
        type: "Print",
        variable: variable
      };
    }

While
  = "while" _ "(" variable:Identifier ")" _ ":" _ body:Statement+ _ ":" _ {
      
      return {
        type: "WhileVariable",
        variable: variable,
        body: body
      };
    }
  /"while" _ "(" _  variable:Identifier _ condition:Condition  _ ":" _ body:Statement+  _ ":" _ {
    return {
      type: "WhileCondition",
      variable: variable,
      condition: condition,
      body:body
    };
  }

Condition
  =  operador:Operador _ variable:Identifier _ ")"{
      return {
        type: "Condition",
        variable: variable,
        operador: operador,
      };
    }

Operador 
  = "=="{
    return{
       type: "Operador",
        operador: "=="

    }
  }
  / "and" {
    return{
       type: "Operador",
        operador: "&&"

    }
  }  
  / "or"{
    return{
       type: "Operador",
        operador: "||"
    }
  }

Val
  = [a-z0-9]* { return text(); }

Parameters
  = head:Identifier tail:(_ "," _ Identifier)* {
      return [head, ...tail.map(item => item[3])];
    }

Identifier
  = [a-z][a-z0-9_]* { return text(); }

Integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

Float
  = digits:[0-9]+ "." [0-9]+ { return parseFloat(text()); }

Message
  = '"' chars:([^"]*) '"' { return chars.join(""); }

Char
  = "'" char:CharLiteral "'" { return char; }

CharLiteral
  = [a-zA-Z0-9] { return text(); }

Value
  = "true" { return { type: "BoolValue", value: true }; }
  / "false" { return { type: "BoolValue", value: false }; }

_ "whitespace"
  = [ \t\n\r]*
