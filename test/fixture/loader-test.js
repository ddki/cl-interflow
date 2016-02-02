var fun = function (a, b) {
    return a + b;
};

fun.mul = function (a, b) {
    return a * b;
};

fun.mul.next = function (a, b){
    return a / b;
};

fun.obj = {a: 10};
module.exports = fun;
