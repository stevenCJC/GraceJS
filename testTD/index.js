require(['TD/var/assert'], function (assert) {
    var a = { a: 1 };
    var b = { a: 2 };
    var c = { a: 1 };
    assert.block('Text Begin.');

    assert.ok(a == c, 'ok?', { a: a, c: c });
    assert.sa(a, b, 'a b sa?', { a: a, b: b });
    assert.eq(a, a, 'a a eq?', { a: a });
    assert.block('Text Begin.Text Begin.');

    assert.ok(a == c, 'ok?', { a: a, c: c });
    assert.sa(a, b, 'a b sa?', { a: a, b: b });
    assert.eq(a, a, 'a a eq?', { a: a });
    assert.block('Text Begin.Text Begin.Text Begin.');

    assert.ok(a, 'ok?', { a: a, c: c });
    setTimeout(function () {
        assert.block('Async Text Begin.');
        assert.ok(a, 'ok?', { a: a, c: c });
        assert.blockEnd();
        assert.block('Async Text Begin.Text Begin.');
        assert.eq(a, c, 'a c eq?', { a: a, c: c });
        assert.blockEnd();
    }, 3000)
    assert.blockEnd();
    assert.eq(a, c, 'a c eq?', { a: a, c: c });
    assert.deq(a, c, 'a c deq?', { a: a, c: c });
    assert.deq(a, b, 'a b deq?', { a: a, b: b });

    assert.blockEnd();
    assert.eq(a, c, 'a c eq?', { a: a, c: c });
    assert.deq(a, c, 'a c deq?', { a: a, c: c });
    assert.deq(a, b, 'a b deq?', { a: a, b: b });

    assert.blockEnd();
	
});

