const ctx = require.context('./', true, /\.js$/)
for (const key of ctx.keys())
{
    if(key.indexOf("index.js") >=0 )
    {
        continue
    }
    const keyArr = key.split('/')
    keyArr.shift() // 移除.
    exports[keyArr.join('.').replace(/\.js$/g, '')] = ctx(key)
}