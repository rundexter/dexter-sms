# Process Step Implementation
> This folder contains the scaffolding for the files required for implementing
> a process step. 

## File Details
### index.js
> Entrypoint for your step and must export an object in the root that minimally
> contains a run method. The run method executes in the scope of the
> surrounding object (and extends a base Step prototype defined by the engine).
> What's important is that within the run method you call
> this.complete(&lt;args&gt;)

### package.json
> Standard npm package.json. The name of your step will need to be unique if it
> is published to the global process registry (not implemented yet). 

### meta.json
> Metadata required by the process engine. You should update this --
> instructions within.

### form 
> View README.md within for details

## Implmentation Details

### Registering the module
> Once you're done creating the step you must register the step with the process
> backend before you can use it on a flow. This is done by navigating to the
> step folder in ~/elements/<step-name> and running 

```shell
$ register .
```

### Secrets
> You are operating in a shared space, so while there is a reasonable expectation
> of privacy, it is ultimately the developers responsibility to keep all
> passwords and secrets off of the file system. In order to pass secret keys to
> your flows use the following command: 

```shell
$ process_env <path-to-mod> <key> <value>
```

> The secret will be available to you at runtime via 

```javascript
this.env('key') // value will be returned
```
