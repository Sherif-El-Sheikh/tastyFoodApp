import React from 'react';
import deleteAvatar from '../../../../assets/images/no-data.png';

export default function DeleteData({deleteItem}) {
  return (
    <div className='text-center deleteData'>
        <img src={deleteAvatar} className='img-fluid mb-3' alt="delete Avatar" />
        <h5 className='mb-2'>Delete This {deleteItem} ?</h5>
        <p>are you sure you want to delete this item ? if you are sure just click on delete it</p>
    </div>
  )
}
