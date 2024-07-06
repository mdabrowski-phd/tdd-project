# Description
This is a repo containing all the source code for the ["Learning Test-Driven Development"](https://learning.oreilly.com/library/view/learning-test-driven-development/9781098106461/) book, published by O'Reilly. To understand the evolution and purpose of the code, you need the accompanying book.

# How to run tests
You need to install the runtime environments for [Go](https://golang.org/), [Node.js](https://nodejs.org/en/), and [Python 3](https://www.python.org/) to run the code in this repo. In brief, use the following commands to run the tests for each language, one-by-one or in random order. Additionally, the continuous integration (CI) pipeline is implemented using gitHub Actions.

## Go
```
cd go
go test -v ./...
go test -v -shuffle on ./...
```

## JavaScript
```
node js/test_money.js
```

## Python
```
python3 py/test_money.py -v
pytest py/test_money.py -v --random-order
