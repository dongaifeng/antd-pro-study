import request from 'umi-request';


export async function quertList(params: {name: string}) {
  return request('/api/ddd', {
    params
  })
}
export async function queryData(data: any) {
  return request('/api/forms', {
    method: 'POST',
    data
  })
}
export async function queryTableList(data: any) {
  return request('/api/list', {
    method: 'POST',
    data
  })
}