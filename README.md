# json-branch-prune

### Installation
```
npm install json-branch-prune
```

### Default usage
#### Will trim branches from a json tree when the branch terminates in either `undefined`, `null`, `""`, `[]`, or `{}`
```
let prune = require("json-branch-prune");

let someJson = {};

let resultJson = prune(someJson); // => {}
```

#### Examples

##### Default usage vs options 
```
prune(input); /* is the same as */ prune(input, [null, "", "{}", "[]"]);
```

##### Default functionality - simple
```
let input = 
{
    null: null,
    emptyString: "",
    emptyArray: [],
    emptyObject: {}
};

prune(input); // -> {}
```

##### Default functionality - nested
```
{
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
}

prune(input); // ->
{
  level1: {
    level2: {
      level3: {
        array4: [{ item: "here" }]
      }
    }
  }
}
```

##### Custom functionality - only prune empty objects
###### This will leave null, empty strings and empty arrays intact
```
{
  null: null,
  emptyString: "",
  emptyArray: [],
  emptyObject: {}
}

prune(input); // ->
{
  null: null,
  emptyString: "",
  emptyArray: []
}
```
