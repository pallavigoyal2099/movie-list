import React from "react";

import loading from "../../assets/loading.gif";

const Loading = () => {
  return (
    <div className="loading">
      <img src={loading} alt="loading" />
    </div>
  );
};

export default Loading;
