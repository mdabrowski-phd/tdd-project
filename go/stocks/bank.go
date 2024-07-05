package stocks

import "errors"

type Bank struct {
	exchangeRates map[string]float64
}

func (b Bank) AddExchangeRate(currencyFrom string, currencyTo string, rate float64) {
	key := currencyFrom + "->" + currencyTo
	b.exchangeRates[key] = rate
}

func (b Bank) Convert(money Money, currency string) (convertedMoney *Money, err error) {
	var result Money
	if money.currency == currency {
		result = NewMoney(money.amount, currency)
		return &result, nil
	}
	key := money.currency + "->" + currency
	rate, ok := b.exchangeRates[key]
	if ok {
		result = NewMoney(money.amount*rate, currency)
		return &result, nil
	}
	return nil, errors.New(key)
}

func NewBank() Bank {
	return Bank{exchangeRates: make(map[string]float64)}
}
