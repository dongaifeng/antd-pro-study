import request from 'umi-request';


export async function quertList(params: {name: string}) {


  return request('/api/ddd', {
    params
  })
}