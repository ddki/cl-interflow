var fun = function (a, b) {
    return a + b;
};

fun.mul = function (a, b) {
    return a * b;
};

fun.mul.next = function (a, b){
    return a / b;
};

fun.addp = function (a, b){
    return new Promise(function (r) {
        setTimeout(function (){
            r(a + b);
        }, 30);
    });
};

fun.testCtx = function () {
    return this.test_var;
};

fun.obj = {a: 10};
module.exports = fun;
