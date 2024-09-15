import React from 'react'

function Navbar() {
  return (
    <>
        <nav className='w-full h-16 bg-stone-900 flex justify-between text-sm px-[2em] items-center md:px-[6em] lg:px-[25em]'>
            <left>
                <h3>NewsApp</h3>
            </left>
            <right className='hidden md:flex md:gap-10 md:visible'>
                <p className='cursor-pointer'>Home</p>
                <p className='cursor-pointer'>About</p>
                <p className='cursor-pointer'>Contact</p>
            </right>
        </nav>
    </>
  )
}

export default Navbar