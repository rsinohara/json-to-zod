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
