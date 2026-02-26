//Javascript rules
Variable names must not be reserved keywords.
Variable names must not be literals (true, false, null, undefined).
Variable names must not start with a number.
Variable names must not contain special characters.
Variable names must not contain spaces.
Variable names must be unique.
Variable names are case-sensitive.
constant Variables should be declared with uppercase only 

//Javascript additional
Variable names can contain letters (a–z, A–Z), digits (0–9), underscores (_), and dollar signs ($).
Variable names must start with a letter, underscore (_), or dollar sign ($) — but not a digit.
JavaScript variable names are Unicode-aware, so they can technically include Unicode characters (though not recommended for readability).
You cannot declare the same variable twice using let or const in the same scope.
const variables must be initialized at the time of declaration.
const variables cannot be reassigned after declaration.
Avoid using JavaScript built-in object names (like Object, Array, String) as variable names to prevent confusion or conflicts.
Variable names should not shadow variables in the same scope unnecessarily.

//typescript rules
Naming Rules (Same as JavaScript)
Must not be reserved keywords (class, function, let, etc.).
Must not be literals (true, false, null, undefined).
Must not start with a number.
Must not contain spaces.
Must not contain special characters (except _ and $).
Must start with a letter, _, or $.
Can contain letters, digits, _, and $.
Variable names are case-sensitive.

//Declaration Rules
Variables must be declared using: let, const, var (not recommended, but valid)
const variables:     Must be initialized at declaration & Cannot be reassigned.
You cannot redeclare a variable with let or const in the same scope.
var allows redeclaration in the same scope (but should be avoided).

//Type Rules (TypeScript-Specific)
TypeScript supports static typing.
    If a type is declared, the variable must follow that type.
    If no type is given, TypeScript uses type inference.
    Variables cannot change type after being inferred.

Strict Mode Rules (When strict is enabled)
    Variables cannot be used before assignment.
    any type is discouraged (and restricted in strict mode if configured).
    null and undefined must be explicitly allowed if strictNullChecks is enabled.
