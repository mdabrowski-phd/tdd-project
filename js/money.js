class Money {
    constructor(amount, currency) {
      this.amount = amount;
      this.currency = currency;
    }
  
    times(multiplier) {
      return new Money(this.amount * multiplier, this.currency);
    }
  
    divide(divisor) {
      return new Money(this.amount / divisor, this.currency);
    }

    add(money) {
      if (money.currency !== this.currency) {
          throw new Error("Nie można dodać " + money.currency + " do " + this.currency);
      }
      return new Money(this.amount + money.amount, this.currency);
    }
  }
  
  module.exports = Money;
  