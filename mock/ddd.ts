import { Request, Response } from 'express';

function ddd(req: Request, res: Response) {
  console.log(req.query)
  return res.json({
    name: `${req.query.name}我爱你`
  });
}
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
 

  'GET  /api/ddd': ddd,
};
