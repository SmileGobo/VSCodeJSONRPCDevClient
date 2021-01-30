class Test {
    _foo = null;
    _bar = null;

    assign({foo = null, bar = null}){
        this._foo = item.foo;
        this._bar = item.bar;
        return this;
    }

    run(){
        console.log(`${this._foo} ${this._bar}`);
    }
}

const test = new Test();
let obj = {
    foo: 'Suprse!',
    bar: 'Mother fucker!'
};

test.assign(obj).run();

obj = {
    foo: 'Hello!'
};
test.assign(obj).run();