# Json-to-Zod

## Summary
A very simple CLI tool to convert JSON objects or files into zod schemas.
## Usage
### CLI
```json-to-zod -s myJson.json -t mySchema.ts```

Options: 
  -  --source/-s [source file name]
  -  --target/-t [(optional) target file name]
  -  --name/-n [(optional) schema name in output]
  -  --convertTuples/-c [(optional) handle tuples correctly]

### Programmatic
```typescript
import { jsonToZod } from "json-to-zod"

const myObject = {
    hello: "hi"
}

const result = jsonToZod(myObject)

console.log(result)
```
### Expected output:
```
const schema = z.object({hello: z.string()});
```

### Overriding zod values

Since zod can be more specific about the primitives sometime you want to be
more precise.

Eg. if an string has been parsed to:

```typescript
z.string();
```

But you know it is a date and therefor should be called:

```typescript
z.string().date();
```

Then you can create a configuration file called: `.jtzrc.yml` and define
schema overrides there.

Take a look at the `.jtzrc.yml.example` file.

### Handling Tuples
You can use the `convertTuples` option to handle tuples correctly.

```typescript
import { jsonToZod } from "json-to-zod"

const myTuple = [1, 'some string']

const result = jsonToZod(myTuple, "schema", false, true)

console.log(result)
```
### Expected output:
```
const schema = z.tuple([z.number(), z.string()]);
```
