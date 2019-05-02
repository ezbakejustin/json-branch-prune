# json-branch-prune
This dependency free utility will remove branches from a json tree when the branch
terminates in `undefined`, `null`, `""`, `{}`, `[]`, or custom json elements. With the exception of `undefined`
each of these terminators can be customized by passing the optional conditions argument.

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
let input = 
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
let input = 
{
  null: null,
  emptyString: "",
  emptyArray: [],
  emptyObject: {}
}

prune(input, ["{}"]); // ->
{
  null: null,
  emptyString: "",
  emptyArray: []
}
```

##### Custom json element functionality - also prune a specific object when it is the only item in a node
###### In this case, the element `negation: false` will be left in the object because it is not the sole member of that json branch

```
let input = 
{
  level1: {
    level2: {
      level3: {
        foo: "bar"
      },
      negation: false,
      level3List: [{ item: null }, { item: "" }, {}]
    }
  }
}

prune(input, [null, "", "[]", "{}", '{"negation":false}']); // ->
{
  level1: {
    level2: {
      level3: {
        foo: "bar"
      },
      negation: false
    }
  }
}
```


### Change log
> **1.1.0**
> - Added ability to provide custom json elements to be pruned
