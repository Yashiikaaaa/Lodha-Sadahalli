import React from 'react'

export const PageTitle = ({title}) => {
  return (
    <div className='py-10 flex flex-col w-full'>
        <div className='font-semi-bold uppercase text-2xl md:text-5xl text-lightbrown'>{title}</div>
    </div>
  )
}