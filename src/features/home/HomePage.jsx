import React from 'react';

const HomePage = ({history}) => {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui text container">
          <h1 className="ui inverted stackable header">
            {/* <img
              className="ui image massive"
              src="/assets/logo.png"
              alt="logo"
            /> */}
            <div className="content">Economiser</div>
          </h1>
          <h2>Stack Chips , don't save them !!</h2>
          <div onClick={() => history.push('/events')} className="ui huge white inverted button">
            Dive In
            <i className="right arrow icon" />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
