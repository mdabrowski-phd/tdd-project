package main

import (
	"testing"
)

func TestMultiplication(t *testing.T) {
	fiver := Dollar{
		amount: 5,
	}
	tenner := fiver.Times(2)
	if tenner.amount != 10 {
		t.Errorf("Oczekiwano 10, otrzymano: [%d]", tenner.amount)
	}
}
