module.exports = Router

function Router() {
    this.routes = []
}

Router.prototype.add = function(path, value) {
    var routeInfo = {
        value:value,
        rawPath:path
    }
    var r = /:([_a-z][_a-z0-9])+/gi
    var parameters = []
    var regexpSource = ''
    var index = 0
    for (var match; match = r.exec(path); ) {
        regexpSource += escapeRegexpLiteral(path.substring(index, match.index))
        regexpSource += '([^\/]+?)'
        parameters.push(match[1])
        index = match.index + match[0].length
    }
    routeInfo.path = path
    if (parameters.length) {
        regexpSource += escapeRegexpLiteral(path.substring(index))
        var regexp = new RegExp("^" + regexpSource + "$")
        routeInfo.parameters = parameters
        routeInfo.regexp = regexp
        routeInfo.test = function(path) {
            var match = regexp.exec(path)
            if (!match) { return false }
            var params = {}
            parameters.forEach(function(name, index) {
                params[name] = match[index+1]
            })
            return params
        }
    } else {
        routeInfo.test = function(testPath) { return testPath === path && {} }
    }
    this.routes.push(routeInfo)
    return routeInfo
}

Router.prototype.route = function(path) {
    var routes = this.routes
    var i = 0
    function nextRoute() {
        var params
        var length = routes.length
        for (; i<length; i++) {
            var route = routes[i]
            if ((params = route.test(path))) {
                return {
                    route:route,
                    value:route.value,
                    params:params,
                    next:nextRoute
                }
            }
        }
        return false
    }
    return nextRoute()
}

function escapeRegexpLiteral(s) {
    return s.replace(/(\W)/g, '\\$1')
}