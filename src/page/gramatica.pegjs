// grammar.pegjs
Start
  = Program

Program
  = Statement*

Statement
  = Declaration
  / Function
  / Switch 
  / While
  / If
  
Declaration 
= "int" _ Identifier _ ("=" _ Integer)? _ ("," DeclarationInt)* ";"
/ "float" _ Identifier _ ("=" _ Integer.Integer)? _ ("," DeclarationFloat)* ";"
/ "string" _ Identifier _ ("=" _ Message )? _ ("," DeclarationString)* ";"
/ "bool" _ Identifier _ ("=" _ Value)? _ ("," DeclarationBool)* ";"
 / "char" _ Identifier _("=" _ CharLiteral)? _ ("," DeclarationChar)* ";"


DeclarationInt = _ Identifier _ ("=" _ Integer)?
DeclarationFloat = _ Identifier _ ("=" _ Integer.Integer)?
DeclarationString = _ Identifier _ ("=" _ '"' Message '"' )?
DeclarationBool = _ Identifier _ ("=" _ Value )?
DeclarationChar = "char" _ Identifier _ "=" _ CharLiteral 

CharLiteral = "'" Letter "'"

Letter = [a-zA-Z]



Function =  "func" _ Identifier _ "(" _ Parameters? _ ")"_ ":" _ Word _ Return _ ":"
Switch = "switch" _ "(" _ Identifier _ ")" _ "{"_ Case+ _ "exit" _ "}"
While = "while" _ "(" _ Parameters? _ ")" _  ":" _ Word _ ":"
If = "if" _ "(" _ Parameters? _ ")"_ ":" _ Word _ ":"


Word = "contenido" _ ";"

Case = "case_" Identifier _ "(" _ Statement _ ")" _

Parameters 
= Identifier (_ Operation _ Identifier _)*

Identifier = [a-zA-Z][A-Za-z0-9_]*


Value = "true"
/ "false"

Operation = "=="
/ "and"
/ "or"
/ "nor"

Return = "return"_ Identifier _ ";"

Message = '"' chars:([^"]*) '"' { return chars.join(""); }



Integer = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "espacio" = [ \t\n\r]* { return null; }