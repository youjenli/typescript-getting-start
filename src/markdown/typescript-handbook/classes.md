# TypeScript 學習筆記 - 類別

## 基本概念

### 類別宣告的範例

```typescript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

### 繼承的範例

```typescript
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

#### 子類別要在建構子裡建立父類別的實例、複寫 (override) 方法

就像 java 那樣強型態的語言一樣，typescript 的子類別必須在調用自己的屬性之前先建構父類別的實例：

```typescript
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

此範例也同時展示子類別複寫父母類別的做法。

### public, private, and protected 修飾詞

Typescript 就像 Java 那樣可藉由 `public`, `private`, `protected` 等修飾詞設定各方法與屬性的存取權限。
前面例子中每個類別的屬性宣告都沒有存取權修飾詞，然而轉譯後預設是可公開存取的，等同於 `public` 修飾的效果預設的存取權限是 public 而不像 java 是 package-private。


。：