const assert = require("assert");
const Money = require("./money");
const Portfolio = require("./portfolio");
const Bank = require("./bank");

class MoneyTest {
  setUp() {
    this.bank = new Bank();
    this.bank.addExchangeRate("EUR", "USD", 1.2);
    this.bank.addExchangeRate("USD", "KRW", 1100);
  }

  testMultiplication() {
    let tenEuros = new Money(10, "EUR");
    let twentyEuros = new Money(20, "EUR");
    assert.deepStrictEqual(tenEuros.times(2), twentyEuros);
  }

  testDivision() {
    let originalMoney = new Money(4002, "KRW");
    let moneyAfterDivision = new Money(1000.5, "KRW");
    assert.deepStrictEqual(originalMoney.divide(4), moneyAfterDivision);
  }

  testAddition() {
    let fiveDollars = new Money(5, "USD");
    let tenDollars = new Money(10, "USD");
    let fifteenDollars = new Money(15, "USD");

    let portfolio = new Portfolio();
    portfolio.add(fiveDollars, tenDollars);
    assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"), fifteenDollars);
  }

  testAdditionOfDollarsAndEuros() {
    let fiveDollars = new Money(5, "USD");
    let tenEuros = new Money(10, "EUR");
    
    let portfolio = new Portfolio();
    portfolio.add(fiveDollars, tenEuros);
    let expectedValue = new Money(17, "USD");
    assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"), expectedValue);
  }

  testAdditionOfDollarsAndWons() {
    let oneDollar = new Money(1, "USD");
    let elevenHundredWons = new Money(1100, "KRW");

    let portfolio = new Portfolio();
    portfolio.add(oneDollar, elevenHundredWons);
    let expectedValue = new Money(2200, "KRW");
    assert.deepStrictEqual(portfolio.evaluate(this.bank, "KRW"), expectedValue);
  }

  testAdditionWithMultipleMissingExchangeRates() {
    let oneDollar = new Money(1, "USD");
    let oneEuro = new Money(1, "EUR");
    let oneWon = new Money(1, "KRW");

    let portfolio = new Portfolio();
    portfolio.add(oneDollar, oneEuro, oneWon);
    let expectedError = new Error("Brakuje kursu (kursów) wymiany: [ USD->Kalganid, EUR->Kalganid, KRW->Kalganid ]");
    assert.throws(() => portfolio.evaluate(this.bank, "Kalganid"), expectedError);
  }

  testConversionWithDifferentRatesBetweenTwoCurrencies() {
    let tenEuros = new Money(10, "EUR");
    assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(12, "USD"));
    
    this.bank.addExchangeRate("EUR", "USD", 1.3);
    assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(13, "USD"));
  }

  testConversionWithMissingExchangeRate() {
    let tenEuros = new Money(10, "EUR");
    let expectedError = new Error("EUR->Kalganid");
    assert.throws(() => this.bank.convert(tenEuros, "Kalganid"), expectedError);
  }

  testAdditionWithTestDouble() {
    const moneyCount = 10;
    let moneys = []
    for (let i = 0; i < moneyCount; i++) {
      moneys.push(new Money(Math.random(Number.MAX_SAFE_INTEGER), "Nie ma znaczenia"));
    }
    let bank = {
      convert: function () {
        return new Money(Math.PI, "Kalganid");
      }
    };
    
    let arbitraryResult = new Money(moneyCount * Math.PI, "Kalganid");
    let portfolio = new Portfolio();
    portfolio.add(...moneys);
    assert.deepStrictEqual(portfolio.evaluate(bank, "Kalganid"), arbitraryResult);
  }

  testAddTwoMoneysInSameCurrency() {
    let fiveKalganid = new Money(5, "Kalganid");
    let tenKalganid = new Money(10, "Kalganid");
    let fifteenKalganid = new Money(15, "Kalganid");
    
    assert.deepStrictEqual(fiveKalganid.add(tenKalganid), fifteenKalganid);
    assert.deepStrictEqual(tenKalganid.add(fiveKalganid), fifteenKalganid);
  }

  testAddTwoMoneysInDifferentCurrencies() {
    let oneEuro = new Money(1, "EUR");
    let oneDollar = new Money(1, "USD");
    
    let expectedError = new Error("Nie można dodać USD do EUR")
    assert.throws(function () { oneEuro.add(oneDollar); }, expectedError);

    expectedError = new Error("Nie można dodać EUR do USD")
    assert.throws(function () { oneDollar.add(oneEuro); }, expectedError);
  }

  runAllTests() {
    let testMethods = this.getAllTestMethods();
    testMethods.forEach((m) => {
      console.log("Uruchamianie: %s()", m);
      let method = Reflect.get(this, m);
      try {
        this.setUp();
        Reflect.apply(method, this, []);
      } catch(e) {
        if (e instanceof assert.AssertionError) {
          console.log(e);
        } else {
          throw e;
        }
      }
    });
  }

  getAllTestMethods() {
    let moneyPrototype = MoneyTest.prototype;
    let allProps = Object.getOwnPropertyNames(moneyPrototype);
    let testMethods = allProps.filter((p) => {
      return typeof moneyPrototype[p] === "function" && p.startsWith("test");
    });
    return this.randomizeTestOrder(testMethods);
  }

  randomizeTestOrder(testMethods) {
    for (let i = testMethods.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [testMethods[i], testMethods[j]] = [testMethods[j], testMethods[i]];
    }
    return testMethods;
  }
}

new MoneyTest().runAllTests();
