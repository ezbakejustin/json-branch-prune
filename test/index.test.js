const assert = require("assert");

describe("Prune tests", () => {
  let instance = require("../index");

  it("Empty Object", () => {
    let result = instance({});
    assert.deepEqual(result, {});
  });

  it("Undefined", () => {
    let result = instance(undefined);
    assert.deepEqual(result, {});
  });

  it("Null", () => {
    let result = instance(null);
    assert.deepEqual(result, {});
  });

  it("Null - Allowed", () => {
    let result = instance(null, ["", "{}", "[]"]);
    assert.equal(result, null);
  });

  it("Empty Array", () => {
    let result = instance([]);
    assert.deepEqual(result, []);
  });

  it("Empty String", () => {
    let result = instance("");
    assert.deepEqual(result, {});
  });

  it("Empty String - Allowed", () => {
    let result = instance("", []);
    assert.deepEqual(result, "");
  });

  it("String", () => {
    let result = instance("foo");
    assert.deepEqual(result, "foo");
  });

  it("Number", () => {
    let result = instance(42);
    assert.deepEqual(result, 42);
  });

  it("One Level - no prune", () => {
    const input = {
      level1: "something"
    };
    let result = instance(input);
    assert.deepEqual(result, input);
  });

  it("One Level - undefined - prune", () => {
    const input = {
      level1: undefined
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("One Level - null - prune", () => {
    const input = {
      level1: null
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("One Level - null allowed - no prune", () => {
    const input = {
      level1: null
    };
    let result = instance(input, []);
    assert.deepEqual(result, input);
  });

  it("One Level - empty string - prune", () => {
    const input = {
      level1: ""
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("One Level - empty string allowed - no prune", () => {
    const input = {
      level1: ""
    };
    let result = instance(input, []);
    assert.deepEqual(result, input);
  });

  it("One Level - empty object - prune", () => {
    const input = {
      level1: {}
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("One Level - empty object allowed - no prune", () => {
    const input = {
      level1: {}
    };
    let result = instance(input, []);
    assert.deepEqual(result, input);
  });

  it("One Level - array - prune", () => {
    const input = {
      level1: []
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("Two Levels - empty object - prune", () => {
    const input = {
      level1: {
        level2: {}
      }
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("Three Levels - empty object - prune", () => {
    const input = {
      level1: {
        level2: {
          level3: {}
        }
      }
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("Two Levels - empty array - prune", () => {
    const input = {
      level1: {
        level2: []
      }
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  it("Two Levels - pruned array - prune", () => {
    const input = {
      level1: [{}, {}]
    };
    let result = instance(input);
    assert.deepEqual(result, {});
  });

  describe("Options tests", () => {
    const json = {
      null: null,
      emptyString: "",
      emptyArray: [],
      emptyObject: {}
    };

    it("Unsupported Option", () => {
      let result = instance(JSON.parse(JSON.stringify(json)), [null, "&"]);
      assert.deepEqual(result, {
        emptyString: "",
        emptyArray: [],
        emptyObject: {}
      });
    });

    it("Only Prune null", () => {
      let result = instance(JSON.parse(JSON.stringify(json)), [null]);
      assert.deepEqual(result, {
        emptyString: "",
        emptyArray: [],
        emptyObject: {}
      });
    });

    it("Only Prune Empty String", () => {
      let result = instance(JSON.parse(JSON.stringify(json)), [""]);
      JSON.stringify(result);
      assert.deepEqual(result, {
        null: null,
        emptyArray: [],
        emptyObject: {}
      });
    });

    it("Only Prune Empty Array", () => {
      let result = instance(JSON.parse(JSON.stringify(json)), ["[]"]);
      JSON.stringify(result);
      assert.deepEqual(result, {
        null: null,
        emptyString: "",
        emptyObject: {}
      });
    });

    it("Only Prune Empty Object", () => {
      let result = instance(JSON.parse(JSON.stringify(json)), ["{}"]);
      JSON.stringify(result);
      assert.deepEqual(result, {
        null: null,
        emptyString: "",
        emptyArray: []
      });
    });
  });

  it("Deep test", () => {
    const test = {
      level1: {
        level1Item: "",
        level2: {
          level2Item: null,
          level3: {
            level3Item: undefined,
            array4: [
              {
                item5: null
              },
              {
                items: [
                  {
                    nested: {
                      foo: {
                        bar: {
                          biz: {
                            baz: {}
                          }
                        }
                      }
                    }
                  }
                ]
              },
              {
                item: undefined
              },
              {
                item: ""
              },
              {},
              {
                item: "here"
              }
            ]
          }
        },
        level2b: {}
      }
    };
    let result = instance(test);
    assert.deepEqual(result, {
      level1: {
        level2: {
          level3: {
            array4: [{ item: "here" }]
          }
        }
      }
    });
  });
});
