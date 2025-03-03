import React from "react";
import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: "text",
  size: props.small ? 5 : undefined
}))`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 2px solid #2DDC1B;
  padding: 0 32px 0 16px;
`;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
  {/* <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/> */}
    <Input
      id="search"
      type="text"
    
      placeholder="search"
      value={filterText}
      onChange={onFilter}
    />
    {/* <ClearButton onClick={onClear} style={{color:'red',border:'1px solid green',fontWeight:'700'}}>X</ClearButton> */}
  </>
);

export default FilterComponent;