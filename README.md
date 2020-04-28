# vmbabel-runtime
同步可以满足需求，先不做异步了
```ts
import {excute} from 'vmbabel-runtime'

const code = `
	interface Params{
		id:string;
		tag: string;
	}
    function getNewName(param: Params) {
		return id + '_' + tag	
	}
	function $excute() {
		return getNewName(context.params)
	}
`
const data = excute({code, 'ts'})
console.log(data)
```
