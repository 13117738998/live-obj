
export default [
  {
    path: '/:panoId',
    name: 'Pano',
    component: () => import('@/views/index'),
  },
  {
    path: '/test/:panoId',
    name: 'Test',
    component: () => import('@/views/index'),
  },
]
