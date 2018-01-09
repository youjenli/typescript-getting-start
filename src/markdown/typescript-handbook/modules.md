# TypeScript 學習筆記 - 模組 (Modules)

開始之前要先列出 Typescript 官方提醒事項：

> A note about terminology: It’s important to note that in TypeScript 1.5, the nomenclature(命名法) has changed. **“Internal modules” are now “namespaces”. “External modules” are now simply “modules”**, as to align with [ECMAScript 2015][ECMAScript 2015]’s terminology, (namely that `module X {` is equivalent to the now-preferred `namespace X {`).  

從 ECMAScript 2015 年開始，JavaScript 有`模組`(module)的概念。

模組執行時有屬於自己變數與函式的作用範圍

[ECMAScript 2015]: http://www.ecma-international.org/ecma-262/6.0/ "ECMAScript® 2015 Language Specification"

## 輸出模組 (Export)

### 輸出宣告 (Exporting a declaration)

Any declaration (such as a variable, function, class, type alias, or interface) can be exported by adding the export keyword.

```typescript
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

### 輸出模組的語句 (Export statements)

Export statements are handy when exports need to be renamed for consumers, so the above example can be written as:

```typescript
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```
### 重新輸出 (Re-exports)

你可以在目前的模組裡面再次輸出其他既有的模組，被輸出的模組不會引入到輸出它的模組，或是產生額外的變數。

ParseIntBasedZipCodeValidator.ts

```typescript
export class ParseIntBasedZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && parseInt(s).toString() === s;
    }
}

// Export original validator but rename it
export {ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator";
```

除此之外，一個模組可以用 `export * from "module"` 這樣的語法輸出其他模組提供的東西：

```typescript
export * from "./StringValidator"; // exports interface 'StringValidator'
export * from "./LettersOnlyValidator"; // exports class 'LettersOnlyValidator'
export * from "./ZipCodeValidator";  // exports class 'ZipCodeValidator'
```

## 輸入模組 (Import)

Import a single export from a module

```typescript
import { ZipCodeValidator } from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
```

你可以改變輸入的模組內容之名稱

```typescript
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
let myValidator = new ZCV();
```

也可以把整個模組引入到一個變數，然後再從變數去存取模組內容。

```typescript
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();
```

### 輸入有副作用的模組

Though not recommended practice, some modules set up some global state that can be used by other modules. These modules may not have any exports, or the consumer is not interested in any of their exports. To import these modules, use:

```typescript
import "./my-module.js";
```

## 預設的輸出內容 (Default exports)

Each module can optionally export a `default` export. Default exports are marked with the keyword `default`; and there can only be one `default` export per module. `default` exports are imported using a different import form.

#### JQuery.d.ts

```typescript
declare let $: JQuery; //??? declare
export default $;
```

引入時就這樣做：

#### App.ts

```typescript
import $ from "JQuery";

$("button.continue").html( "Next Step..." );
```

開發人員想引入模組的預設輸出內容時，可以直接存取而不用提供模組的名稱。

#### ZipCodeValidator.ts

```typescript
export default class ZipCodeValidator {
    static numberRegexp = /^[0-9]+$/;
    isAcceptable(s: string) {
        return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
    }
}
```

#### Test.ts

```typescript
import validator from "./ZipCodeValidator"; //使用 validator 而不是 ZipCodeValidator 這個名稱

let myValidator = new validator();
```

就算要引入的模組有多項輸出內容，此規則一樣有效：

#### StaticZipCodeValidator.ts

```typescript
const numberRegexp = /^[0-9]+$/;

export default function (s: string) {
    return s.length === 5 && numberRegexp.test(s);
}
```

#### Test.ts

```typescript
import validate from "./StaticZipCodeValidator";

let strings = ["Hello", "98052", "101"];

// Use function validate
strings.forEach(s => {
  console.log(`"${s}" ${validate(s) ? " matches" : " does not match"}`);
});
```

預設的輸出內容也可以只是數值或字串。

#### OneTwoThree.ts

```typescript
export default "123";
```

#### Log.ts

```typescript
import num from "./OneTwoThree";
console.log(num); // "123"
```

## `export =` and `import = require()`

Both CommonJS and AMD generally have the concept of an `exports` object which contains all exports from a module.

They also support replacing the `exports` object with a custom single object. Default exports are meant to act as a replacement for this behavior; however, the two are incompatible. TypeScript supports `export =` to model the traditional CommonJS and AMD workflow.

The `export =` syntax specifies a single object that is exported from the module. This can be a class, interface, namespace, function, or enum.

When importing a module using `export =`, TypeScript-specific `import module = require("module")` must be used to import the module.

#### ZipCodeValidator.ts

```typescript
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export = ZipCodeValidator;
```

#### Test.ts

```typescript
import zip = require("./ZipCodeValidator");

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(`"${ s }" - ${ validator.isAcceptable(s) ? "matches" : "does not match" }`);
});
```

## 為模組產生程式碼

Depending on the module target specified during compilation, the compiler will generate appropriate code for [Node.js][CommonJS] (CommonJS), [require.js][AMD] (AMD), [isomorphic][UMD] (UMD), [SystemJS][SystemJS], or [ECMAScript 2015 native modules][ES6] (ES6) module-loading systems. For more information on what the define, require and register calls in the generated code do, consult the documentation for each module loader.

[CommonJS]: http://wiki.commonjs.org/wiki/CommonJS "CommonJS"
[AMD]: https://github.com/amdjs/amdjs-api/wiki/AMD "AMD"
[UMD]: https://github.com/umdjs/umd "UMD"
[SystemJS]: https://github.com/systemjs/systemjs/graphs/contributors "SystemJS"
[ES6]: http://www.ecma-international.org/ecma-262/6.0/#sec-modules "ES6"

This simple example shows how the names used during importing and exporting get translated into the module loading code.

#### SimpleModule.ts

```typescript
import m = require("mod");
export let t = m.something + 1;
```

#### AMD / RequireJS SimpleModule.js

```javascript
define(["require", "exports", "./mod"], function (require, exports, mod_1) {
    exports.t = mod_1.something + 1;
});
```

#### CommonJS / Node SimpleModule.js

```javascript
var mod_1 = require("./mod");
exports.t = mod_1.something + 1;
```

#### UMD SimpleModule.js

```javascript
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./mod"], factory);
    }
})(function (require, exports) {
    var mod_1 = require("./mod");
    exports.t = mod_1.something + 1;
});
```

#### System SimpleModule.js

```javascript
System.register(["./mod"], function(exports_1) {
    var mod_1;
    var t;
    return {
        setters:[
            function (mod_1_1) {
                mod_1 = mod_1_1;
            }],
        execute: function() {
            exports_1("t", t = mod_1.something + 1);
        }
    }
});
```

#### Native ECMAScript 2015 modules SimpleModule.js

```javascript
import { something } from "./mod";
export var t = something + 1;
```

### Simple Example

//?? 這段還是不懂它想表達什麼

### Optional Module Loading and Other Advanced Loading Scenarios

//?? 這段看不懂

實現模組時經常會，。：

像這樣在軟體內重新輸出模組的狀況不會在該模組

### Working with Other JavaScript Libraries

To describe the shape of libraries not written in TypeScript, we need to declare the API that the library exposes.

We call declarations that don’t define an implementation “ambient”. Typically, these are defined in .d.ts files. If you’re familiar with C/C++, you can think of these as .h files. Let’s look at a few examples.

