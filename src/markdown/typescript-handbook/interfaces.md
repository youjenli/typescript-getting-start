
# TypeScript 學習筆記 - 介面 (interface)

## 物件的型態

Typescript 的介面可以定義物件的型態以作為函式的參數, 請參考[範例](https://jsfiddle.net/98L21zw9/1/)

### 選擇性的屬性

使用 `?:` 符號可以為介面定義開發者不一定要提供的屬性, 請參閱此[範例](https://jsfiddle.net/hy4xLzwg/1/)  
這種設計的優點在於可以讓 typescript 轉譯器防止使用者調用到不屬於此介面的屬性, 例如:

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        // Error: Property 'clor' does not exist on type 'SquareConfig'
        newSquare.color = config.clor;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

#### _屬性檢查_

Typescript 可以根據介面的屬性檢查輸入的參數是否有錯, 例如以下提供給 createSquare 函式的屬性 colour 拼錯了, 這在 javascript 裡面是合法的程式, 但是 typescript 轉譯器會報出錯誤

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

若要強迫函式接收這樣的物件, 那可以使用 `as` 語法轉換型態

```typescript
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

或是定義一個型態不明確的變數指向該物件, 然後再藉由該變數傳遞物件給函式

```typescript
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

#### _彈性的屬性設定-以字串索引的屬性_

除了 as 語法以外, 較適合來為介面提供一定彈性的做法是利用以字串索引的屬性 (string index signature)  
假設前面展示過的類別會有其他屬性, 那就可以這樣定義

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

### 唯讀 (readonly) 的屬性

你可以運用 `readonly` 關鍵字在介面定義建立後就不能再修改的屬性, 例如:

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
//After the assignment, x and y can’t be changed.
p1.x = 5; // error!
```

### readonly vs const

readonly 與 const 修飾詞的差別在於應用場景  
readonly 用在屬性, const 用在變數

#### _唯讀陣例 (ReadonlyArray)_

Typescript 內建唯讀陣列 `ReadonlyArray<T>` 幫助開發者防止不小心變更到陣列的值, 它沒有那些會改變陣列內容的方法

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error! 
//一旦把陣列轉換為 Readonly 之後就不能再轉型回去, 但你還是可以用 type assertion 取代
a = ro as numberp[];
```

根據這個範例我覺得 ReadonlyArray 應該只是個 Interface 而不是 Typescript 語法概念中的 Class

## 函式的型態 (Function Types)

介面可用來定義函式的型態, 也就是要提供的參數以及會回傳的值

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}
//定義完成後, 使用這個介面來宣告函式
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
//附帶一提, 函式實作的變數名稱不一定要和介面相同
```

## 可索引的型態 (Indexable Types)



## 類別的型態 (Class Types)


## 繼承介面 (Extending Interfaces)

介面可以繼承一到多個介面

```typescript
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{}; //注意這裡的語法
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## 混合型態 (Hybrid Types)

## 繼承類別的介面 (Interfaces extending Classes)

介面可以繼承類別，但是會繼承類別的私有 (private) 與受保護 (protected) 的成員。這意謂當介面繼承某個類別之後，只有該類別與其子類別 (subclass) 可以實作此介面。

```typescript
//先定義一個類別
class Control {
    private state: any;
}

//再令 SelectableControl 介面繼承此類別
interface SelectableControl extends Control {
    select(): void;
}

// Button 類別繼承 Control，因此 typescript 轉譯器偵測到它要實作 SelectableControl 時不會跳出錯誤訊息
class Button extends Control implements SelectableControl {
    select() { }
}

// 但是沒有繼承 Control 的類別要實作 SelectableControl 就會跳出錯誤
class Image implements SelectableControl { // Error: Property 'state' is missing in type 'Image'.
    select() { }
}
```

我的理解是繼承類別的介面之特性等同於一般物件導向語言中的虛擬類別。