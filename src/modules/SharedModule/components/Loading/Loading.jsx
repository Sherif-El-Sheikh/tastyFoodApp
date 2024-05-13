import React from 'react'
import { Oval } from 'react-loader-spinner'


export default function Loading() {
  return (
    <div style={{height:'200px'}} className=" d-flex justify-content-center align-items-center">
    <Oval
  visible={true}
  height="80"
  width="80"
  color="#4fa94d"
  ariaLabel="oval-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
</div>
  )
}
