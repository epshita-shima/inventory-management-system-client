import TreeNode from "./TreeNode";

const TreeView = ({
  data,
  clickedCheckboxes,
  setClickedCheckboxes,
  parentIds,
  isUpdate,
  singleUserData,
}) => { 
  return (
    <div>
      {data?.map((node) => (
        <TreeNode
          key={node._id.$oid}
          node={node}
          clickedCheckboxes={clickedCheckboxes}
          setClickedCheckboxes={setClickedCheckboxes}
          parentIds={parentIds}
          isUpdate={isUpdate}
          singleUserData={singleUserData}
          data={data}
        />
      ))}
    </div>
  );
};

export default TreeView;
