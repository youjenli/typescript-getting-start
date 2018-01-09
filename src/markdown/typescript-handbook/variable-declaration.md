# TypeScript 學習筆記 - 變數宣告 (Variable Declarations)

摘錄自 Typescript Handbook - [Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

## 變數宣告

let 關鍵字定義的變數名稱可以和 function 範圍的變數一樣, 只要位在不一樣的區塊即可, 例:

```typescript
function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0); // returns '0'
f(true, 0);  // returns '100'
```

let 定義在迴圈範圍的變數不會被關進 function, 例:

```typescript
for (let i = 0; i < 10 ; i++) {

    setTimeout(function() { console.log(i); }, 100 * i);

}
```

## Array Destructuring 陣列解構

Typescript 可以直接為陣列的成員命名

```typescript
let input = [1, 2];
let [first, second] = input;

console.log(first); // outputs 1
console.log(second); // outputs 2
```

還可以直接改名

```typescript
// swap variables
[first, second] = [second, first];
```

或是作為陣列的參數

```typescript
function f([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}

f([1, 2]);
```

亦或是命名陣列的子集

```typescript
let [first, ...rest] = [1, 2, 3, 4];

console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
```

還可以忽略末尾的參數與特定欄位的變數

```typescript
let [first] = [1, 2, 3, 4];

console.log(first); // outputs 1
let [, second, , fourth] = [1, 2, 3, 4]; 
```
## Object destructuring 物件解構

物件一樣可以解構, 例:

```typescript
let o = {
    a: "foo",
    b: 12,
    c: "bar"
};
let { a, b } = o;

//或是使用 () 運算式在單行內完成
({ a, b } = { a: "baz", b: 101 });
```

除此之外可以使用連點號 `...` 直接把部分屬性命名為一個物件變數

```typescript
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length
```

### _Property renaming 屬性重新命名_

物件的屬性可以用 let 關鍵字重新命名, 例:

```typescript
let { a: newName1, b: newName2 } = o;
//這等同於
let newName1 = o.a;
let newName2 = o.b;
```

要注意, 這裡的冒號`:`不是用來宣告型態, 型態要另外宣告:

```typescript
let { a, b }: { a: string, b: number } = o;
```

### _Default values 預設值_

//TBD  
Default values let you specify a default value in case a property is undefined:

```typescript
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}
```

keepWholeObject now has a variable for wholeObject as well as the properties a and b, even if b is undefined.

## Function declarations 函式宣告

函式宣告的時候可以解構類別, 例如:

```typescript
type C = { a: string, b?: number }
function f({ a, b }: C): void {
    // ...
}
//?: 的意思是非必要的屬性
```

但更常見的狀況是為函式設定預設值

```typescript
function f({ a, b } = { a: "", b: 0 }): void {
    // ...
}
f(); // ok, default to { a: "", b: 0 }
//關係到 Type Inference 的概念
```

//TBD  
Then, you need to remember to give a default for optional properties on the destructured property instead of the main initializer. Remember that C was defined with b optional:

```typescript
function f({ a, b = 0 } = { a: "" }): void {
    // ...
}
f({ a: "yes" }); // ok, default b = 0
f(); // ok, default to { a: "" }, which then defaults b = 0
f({}); // error, 'a' is required if you supply an argument
```

## Spread 推廣

推廣可用來把物件內容轉移到另一個物件, 或是把陣列內容轉移到另一個物件

```typescript
// 陣列的例子
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
```

這會把 `first` 和 `second` 陣列的內容淺層 (shallow) 複製到 bothPlus

```typescript
// 物件的例子
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };
```

但要注意, 較晚定義的屬性會取代前面屬性的值, 例:

```typescript
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { food: "rich", ...defaults };
```

這種情況 `food: "spicy"` 會取代 `food: "rich"`

最後, 物件的推廣有些其他限制  
第一, 他只包含物件 `擁有(own)` 且 `可列舉 (enumerable)` 的屬性, 這表示你推廣物件之後會失去它的方法, 例如:

```typescript
class C {
  p = 12;
  m() {
  }
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // error!
```

//TBD
Second, the Typescript compiler doesn’t allow spreads of type parameters from generic functions. That feature is expected in future versions of the language.