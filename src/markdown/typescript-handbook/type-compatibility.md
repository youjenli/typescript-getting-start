# TypeScript 學習筆記 - 型態相容性 (Type Compatibility)

TypeScript 以類別的結構——也就是類別的成員 (member) 來識別類別而不像 Java 這些強型態的物件導向語言以名目來識別。
官方稱呼這種型態相容性的判別機制為 `structural typing` ，與 Java 這些強型態的物件導向語言採用的 `nominal typing` 相對。

> TypeScript’s structural type system was designed based on how JavaScript code is typically written. Because JavaScript widely uses anonymous objects like function expressions and object literals, it’s much more natural to represent the kinds of relationships found in JavaScript libraries with a structural type system instead of a nominal one.

從如何設計不會使變數傳遞造成功能異常來決定相容性要如何判定

### A Note on Soundness //??? 這段不太懂

TypeScript’s type system allows certain operations that can’t be known at compile-time to be safe. When a type system has this property, it is said to not be “sound”. The places where TypeScript allows unsound behavior were carefully considered, and throughout this document we’ll explain where these happen and the motivating scenarios behind them.

## 比較物件的型態

```typescript
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y; //y OK, 因為 y 有和 x 名稱與型態相同的屬性 name, 所以型態相容, 不會拋出錯誤訊息

//作為函式的執行參數也沒問題
function greet(n: Named) {
    alert("Hello, " + n.name);
}
greet(y); // OK
```

比較型態是否相容的作業會一一比對物件的成員和子成員，直到比較完畢。

## 比較兩個函式 (Comparing two functions)

具有什麼特徵的函式會相容是個值得深入討論的議題。
函式的特徵包含參數與回傳值兩個部分，在此先藉由以下範例說明參數的部分：

```typescript
let x = (a: number) => 0; //接收 number 為參數的函式 
let y = (b: number, s: string) => 0; //接收 number 和 string 為參數的函式 

y = x; // OK 相容
x = y; // Error 不相容
```

比較函式是否相容的規則是變數的型態必須擁有被指派為值的函式所需要的參數與回傳值。
x 接收 number 變數而 y 也有，因此 y = x 沒問題，但因為 y 有第二個必要的參數 s: string 而 x 沒有，所以 x = y 會不相容。
這種應該是以確保型態的操作性作為判斷是否相容的原則。 //TODO

附帶一提，typescript 之所以允許被指派為變數值的函式可以擁有更多的參數是因為這種做法在 js 中是常態，我們呼叫函式時，經常會忽略不提供後續參數。


## 列舉 (Enums)

Enums are compatible with numbers, and numbers are compatible with enums.  
Enum values from different enum types are considered incompatible. For example,

```typescript
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  //error
```

## 類別 (Classes)

Classes work similarly to object literal types and interfaces with one exception: they have both a static and an instance type.  
When comparing two objects of a class type, only members of the instance are compared. Static members and constructors do not affect compatibility. 請參閱[範例][Compatibility of Classes]

[Compatibility of Classes]: https://jsfiddle.net/y2os9q20/1/

### Private and protected members in classes

Private and protected members in a class affect their compatibility. When an instance of a class is checked for compatibility, if the target type contains a private member, then the source type must also contain a private member that originated from the same class. Likewise, the same applies for an instance with a protected member. This allows a class to be assignment compatible with its super class, but not with classes from a different inheritance hierarchy which otherwise have the same shape.

## Generic


，。：。