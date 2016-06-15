'use strict'

// http://math.stackexchange.com/questions/221881/the-intersection-of-n-disks-circles/225089#225089

var Circle = require('circle2-lowdeps')

var circleIntersectionArea = function (_circles) {
  var circles = []
  var vertices = []
  var verticeCircleMap = []
  var vertice
  var i
  var j
  var k

  // of only one circle given, no intersection possible
  if (_circles.length < 2) {
    return []
  }

  // create a circle obj for every circle given
  for (i = _circles.length; i--;) {
    // we except [cx, cy, r]
      circles.push( 
        Circle(
          {latitude: _circles[i].latitude, longitude: _circles[i].longitude},
          _circles[i].radius
        )
      )
  }

  // intersect all circles with eachother
  for (i = circles.length; i-- > 1;) {
    for (j = i; j--;) {
      vertice = circles[i].intersectCircle(circles[j])

      if (vertice) {
        // remember which vertices belong to which circle to avoid floating point errors later
        for (k = vertice.length; k--;) {
          verticeCircleMap[vertices.length + k] = [i, j]
          vertice[k].circles = [circles[i], circles[j]]
        }
        // add vertices to array
        vertices = vertices.concat(vertice)
      }
    }
  }

  // make vertices unique
  for (i = -1, k = vertices.length; i++ < k;) {
    for (j = i + 1; j < vertices.length; ++j) {
      if (vertices[i].latitude == vertices[j].latitude && vertices[i].longitude == vertices[j].longitude) {
        verticeCircleMap.splice(j, 1)
        vertices.splice(j--, 1)
      }
    }
  }

  // filter out vertices which are NOT in all circles
  for (i = circles.length; i--;) {
    for (j = vertices.length; j--;) {
      // if (verticeCircleMap[j].indexOf(i) > -1) continue
      if (!circles[i].containsPoint(vertices[j])) {
        vertices.splice(j, 1)
      }
    }
  }

  // return vertices left which contain all innermost intersections
  return vertices
}

module.exports = circleIntersectionArea
