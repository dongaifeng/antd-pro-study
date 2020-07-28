import { Request, Response } from 'express';
import { List } from '@/pages/myPage/data';

function ddd(req: Request, res: Response) {
  console.log(req.query)
  return res.json({
    name: `${req.query.name}我爱你`
  });
}



const genList = (current: number, pageSize: number) => {
  let tableListDataSource: List[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      name: 'John Brown'+index,
      age: Math.floor(Math.random() * 4),
     
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getList (req: Request, res: Response) {
  const result = {
    data: tableListDataSource,
    total: tableListDataSource.length,
    success: true,
  }

  return res.json(result)
}

function forms(req: Request, res: Response) {
  let tableListDataSource = genList(10, 3);
  const result = {
    data: tableListDataSource,
    total: tableListDataSource.length,
    success: true,
  }
  
  return res.json(result)
}



export default {
  'POST /api/forms': forms,
  'GET  /api/ddd': ddd,
  'POST /api/list': getList
};
