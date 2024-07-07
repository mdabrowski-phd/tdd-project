import unittest
from money import Money
from portfolio import Portfolio
from bank import Bank


class TestMoney(unittest.TestCase):
    def setUp(self):
        self.portfolio = Portfolio()

        self.bank = Bank()
        self.bank.addExchangeRate("EUR", "USD", 1.2)
        self.bank.addExchangeRate("USD", "KRW", 1100)

    def testMultiplication(self):
        tenEuros = Money(10, "EUR")
        twentyEuros = Money(20, "EUR")
        self.assertEqual(twentyEuros, tenEuros.times(2))

    def testDivision(self):
        originalMoney = Money(4002, "KRW")
        expectedMoneyAfterDivision = Money(1000.5, "KRW")
        self.assertEqual(expectedMoneyAfterDivision,
                         originalMoney.divide(4))

    def testAddition(self):
        fiveDollars = Money(5, "USD")
        tenDollars = Money(10, "USD")
        fifteenDollars = Money(15, "USD")

        self.portfolio.add(fiveDollars, tenDollars)
        self.assertEqual(fifteenDollars,
                         self.portfolio.evaluate(self.bank, "USD"))

    def testAdditionOfDollarsAndEuros(self):
        fiveDollars = Money(5, "USD")
        tenEuros = Money(10, "EUR")

        self.portfolio.add(fiveDollars, tenEuros)
        expectedValue = Money(17, "USD")
        actualValue = self.portfolio.evaluate(self.bank, "USD")
        self.assertEqual(expectedValue, actualValue,
                         "%s != %s" % (expectedValue, actualValue))

    def testAdditionOfDollarsAndWons(self):
        oneDollar = Money(1, "USD")
        elevenHundredWons = Money(1100, "KRW")

        self.portfolio.add(oneDollar, elevenHundredWons)
        expectedValue = Money(2200, "KRW")
        actualValue = self.portfolio.evaluate(self.bank, "KRW")
        self.assertEqual(expectedValue, actualValue,
                         "%s != %s" % (expectedValue, actualValue))

    def testAdditionWithMultipleMissingExchangeRates(self):
        oneDollar = Money(1, "USD")
        oneEuro = Money(1, "EUR")
        oneWon = Money(1, "KRW")

        self.portfolio.add(oneDollar, oneEuro, oneWon)
        with self.assertRaisesRegex(
            Exception,
            "Brakuje kursu \(kursów\) wymiany: \[ USD->Kalganid, EUR->Kalganid, KRW->Kalganid \]"
            ):
            self.portfolio.evaluate(self.bank, "Kalganid")

    def testConversionWithDifferentRatesBetweenTwoCurrencies(self):
        tenEuros = Money(10, "EUR")
        result, missingKey = self.bank.convert(tenEuros, "USD")
        self.assertEqual(result, Money(12, "USD"))
        self.assertIsNone(missingKey)

        self.bank.addExchangeRate("EUR", "USD", 1.3)
        result, missingKey = self.bank.convert(tenEuros, "USD")
        self.assertEqual(result, Money(13, "USD"))
        self.assertIsNone(missingKey)

    def testConversionWithMissingExchangeRate(self):
        tenEuros = Money(10, "EUR")
        result, missingKey = self.bank.convert(tenEuros, "Kalganid")
        self.assertIsNone(result)
        self.assertEqual(missingKey, "EUR->Kalganid")

    def testAddMoneysDirectly(self):
        self.assertEqual(Money(15, "USD"), Money(5, "USD") + Money(10, "USD"))
        self.assertEqual(Money(15, "USD"), Money(10, "USD") + Money(5, "USD"))
        self.assertEqual(None, Money(5, "USD") + Money(10, "EUR"))
        self.assertEqual(None, Money(5, "USD") + None)


if __name__ == '__main__':
    unittest.main()
