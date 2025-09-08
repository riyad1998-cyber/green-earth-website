<!-- Answer to the question no:01 -->
var,let and const are used to declare variables in JavaScript.
var is the old way and works everywhere in the code.let is the modern way to declare variables that can be changed later.const is used when the value should never change after being set.
I think for the best practice,we need to use const by default and let only when we need to update the value.

<!-- Answer to the question no:02 -->
map() creates a new array by applying a function to each item.forEach() just loops through items and run code but did'nt return anything.filter() makes a new array with only the items that match a condition.
I should say that,Use map() when we want to transform data,forEach() for side tasks and filter() to pick specific item.
So,map and filter return new arrays, while forEach did'nt return anything.

<!-- Answer to the question no:03 -->
Arrow functions in ES6 are a shorter way to write function.
Instead of writing function name() {}. Arrow function make code cleaner and easier to read.
Example: const add= (a, b) => a + b; is the same as a normal add function.
I prefer arrow functions instead of normal functions.

<!-- Answer to the question no:04 -->
Destructuring in ES6 is a shortcut to take values from arrays or objects and put them into variables.It makes code shorter and easier to read compared to accessing values one by one.
In short, destructuring is like quickly unpacking values into variables.

<!-- Answer to the question no:05 -->
Template literals in ES6 are a new way to work with strings using backticks(`) instead of quotes.
They allow us to directly insert variables or expressions inside ${ }, like: `Hello, ${name}!` instead of "Hello, " + name + "!".
They also support multi-line strings without \n.
The main difference from string concatenation is that template literals are easier to read,write and maintain,especially when combining variables or writing long strings.