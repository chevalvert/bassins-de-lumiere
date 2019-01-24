import { normalize } from 'missing-math'

export default (point, aabb, { keepAspectRatio = false } = {}) => {
  const ratios = keepAspectRatio ? [
    aabb.width > aabb.height ? 1 : (aabb.height / aabb.width),
    aabb.width > aabb.height ? (aabb.width / aabb.height) : 1
  ] : [1, 1]

  return [
    normalize(point[0], aabb.xmin, aabb.xmax) / ratios[0],
    normalize(point[1], aabb.ymin, aabb.ymax) / ratios[1]
  ]
}
