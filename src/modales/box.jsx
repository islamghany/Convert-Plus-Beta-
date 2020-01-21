import React from "react";

const Box = ({
  type,
  handleChange,
  setType,
  pattern,
  value,
  onSubmit,
  register
}) => {
  return (
    <div className="box__body">
      <div className="box__header">
        <h3>{type}</h3>
      </div>
      <div className="box__form">
        <form onSubmit={onSubmit}>
          <input
            name={type}
            onChange={handleChange}
            autoComplete="off"
            pattern={pattern}
            type="text"
            value={value}
          />
          <button
            className="btn btn--contained-primary mg-"
            onClick={() => {
              setType(type);
            }}
          >
            Convert
          </button>
        </form>
      </div>
    </div>
  );
};

export default Box;
