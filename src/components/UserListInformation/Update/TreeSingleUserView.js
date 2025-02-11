import TreeSingleUserNode from "./TreeSingleUserNode";

const TreeSingleUserView = ({ updateDropdownList, updateMenuItem ,parentIds,singleUserData,setSingleUserData}) => {
    return (
      <div>
        {singleUserData?.map((node) => (
          <TreeSingleUserNode
          key={node.trackId} 
          node={node}
          setSingleUserData={setSingleUserData}
          parentIds={parentIds} 
          updateMenuItem ={updateMenuItem }
          updateDropdownList={updateDropdownList}
          />
        ))}
      </div>
    );
  };

  export default TreeSingleUserView