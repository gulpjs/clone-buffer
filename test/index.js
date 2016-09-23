'use strict';

var expect = require('expect');
var Buffer = require('buffer').Buffer;

var cloneBuffer = require('../');

describe('cloneBuffer()', function() {

  afterEach(function(done) {
    expect.restoreSpies();
    done();
  });

  it('throws on non-Buffer', function(done) {
    function invalid() {
      cloneBuffer('test');
    }

    expect(invalid).toThrow('Can only clone Buffer.');
    done();
  });

  it('uses Buffer.from when available', function(done) {
    if (!cloneBuffer.hasFrom()) {
      this.skip();
      return;
    }

    var fromSpy = expect.spyOn(Buffer, 'from').andCallThrough();

    var testBuffer = new Buffer('test');
    var cloned = cloneBuffer(testBuffer);

    expect(cloned).toExist();
    expect(fromSpy).toHaveBeenCalled();
    done();
  });

  it('returns a new Buffer reference', function(done) {
    var testBuffer = new Buffer('test');
    var cloned = cloneBuffer(testBuffer);

    expect(cloned).toExist();
    expect(cloned).toBeA(Buffer);
    expect(cloned).toNotBe(testBuffer);
    done();
  });

  it('does not replicate modifications to the original Buffer', function(done) {
    var testBuffer = new Buffer('test');
    var cloned = cloneBuffer(testBuffer);

    // Test that changes dont modify both pointers
    cloned.write('w');

    expect(testBuffer.toString('utf8')).toEqual('test');
    expect(cloned.toString('utf8')).toEqual('west');
    done();
  });
});
