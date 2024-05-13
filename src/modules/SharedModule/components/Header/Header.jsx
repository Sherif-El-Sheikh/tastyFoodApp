import React from 'react';


export default function Header({title,description,imgUrl,userName}) {
  return (
    <div className="header-container p-3 mx-3 ">
      <div className="row align-items-center">
        <div className="col-md-7 ">
          <div className="content-header px-4">
            <h2 className='px-4 '>{title} <span className='headerUserName'>{userName}</span></h2> 
            <p className="w-75 px-4">{description}</p>
          </div>
        </div>
        <div className="col-md-5">
          <div className="img text-center mt-4 ">
            <img src={imgUrl} className=" img-fluid" alt="avatar" />
          </div>
        </div>
      </div>
    
    </div>

  )
}
