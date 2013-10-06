node-router-core
================

Simple URL/path-based router for node.js

Install
------

    npm install router-core

Examples
--------

Define your router:

```js
var router = new Router

router.add('/foo', value) // literal path
router.add('/bar/:param', value) // path with parameter
```

Get a route

```js
var route = router.route(path)
route.value // original value passed into add method
route.params // object with parameter matches
route.nextRoute // recursive callback to get the next route if this one isn't good enough
```

Internal API
------------

More advanced use-cases require accessing the route list. This can be done by accessing the `router.routes` array in the
following format:

```js
router.routes.forEach(function(route) {
    route.path // original path from add method
    route.value // original value from add method
    route.test(path) // function that returns a parameters object if the path matches, or false
})
```

License
-------
zlib license [LICENSE](LICENSE).