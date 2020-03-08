import React from 'react'
// import { Parallax } from 'react-scroll-parallax';

const Header = () => {
  return (
    <div className="home-header">
      <div id="home-header-sections">
        <section id="home-header-left">
          {/* <Parallax y={[30, -30]}> */}
            <h1 className="capitalize"><span>game of thrones</span></h1>
            <h2 className="capitalize">Books, Houses, Characters...</h2>
            <p>Register or Log in to discover the Game of Thrones Universe.</p>
          {/* </Parallax> */}
        </section>
        <section id="home-header-right">
          <img src="images/game_of_thrones06.jpg" alt="game of thrones movie" />
        </section>
      </div>
    </div>
  )
}

export default Header;