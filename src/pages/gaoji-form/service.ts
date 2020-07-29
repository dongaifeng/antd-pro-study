import request from 'umi-request';

export async function submit (data:any) {
  return request('/api/fakeSubmit', {
    method: 'POST',
    data
  })
}