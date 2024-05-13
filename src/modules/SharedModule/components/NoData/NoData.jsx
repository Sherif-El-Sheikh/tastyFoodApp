import React from 'react';
import noData from '../../../../assets/images/no-data.png';

export default function NoData() {
    return (
    <div className='text-center mt-4 nodata'>
        <img src={noData} className='img-fluid mb-3' alt="nodata avatar" />
        <h3>No Data !</h3>
    </div>
    )
}
