import React, { useState } from "react";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
import { updateMenuItem } from "../../../redux/features/user/updateUserSlice";

const TreeSingleUserNode = ({
  node,
  parentIds,

}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleCheckboxClick = (subNode, parentId, checked) => {
    if (checked) {
      const updatedChild = {
        ...subNode,
        isChecked: checked,
        parentIds: parentId,
      };
      dispatch(updateMenuItem(updatedChild));
    } else {
      const updatedChild = {
        ...subNode,
        isChecked: checked,
        isInserted: checked,
        isUpdated: checked,
        isRemoved: checked,
        isPDF: checked,
        parentIds: parentId,
      };
      dispatch(updateMenuItem(updatedChild));
    }
  };

  const handleCheckboxClickInsert = (subNode, parentId, checked) => {
    const updatedChild = {
      ...subNode,
      isInserted: checked,
      parentIds:  parentId,
    };
    dispatch(updateMenuItem(updatedChild));
  };
  const handleCheckboxClickUpdate = (subNode, parentId, checked) => {
    const updatedChild = {
      ...subNode,
      isUpdated: checked,
      parentIds:  parentId,
    };
    dispatch(updateMenuItem(updatedChild));
  };

  const handleCheckboxClickDelete = (subNode, parentId, checked) => {
    const updatedChild = {
      ...subNode,
      isRemoved: checked,
      parentIds: parentId,
    };
    dispatch(updateMenuItem(updatedChild));
  };
  const handleCheckboxClickPDF = (subNode, parentId, checked) => {
    const updatedChild = { ...subNode, isPDF: checked, parentIds:  parentId };
    dispatch(updateMenuItem(updatedChild));
  };

  return (
    <div style={{ position: "relative" ,overflow: "auto"}}>
      <table className="table table-bordered">
        <tbody>
          <tr className="">
            <td
              colSpan="2"
              style={{
                textAlign: "left",
                paddingLeft: "20px",
                background: "#2DDC1B",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={handleToggle}
            >
              {isOpen ? "-" : "+"} {node.label}
            </td>
          </tr>
          <tr></tr>
          {isOpen && node?.items?.length > 0 && (
            <>
              {node?.items.map((subNode) => {
                return (
                  <tr key={subNode?.trackId}>
                    <td>
                      {subNode?.items?.length > 0 ? (
                        <TreeSingleUserNode
                          node={subNode}
                          parentIds={[...parentIds, node.trackId]}
                        />
                      ) : (
                        <>
                          <input
                            type="checkbox"
                            id={`${subNode?.trackId}`}
                            checked={subNode?.isChecked}
                            name="check"
                            readOnly
                            className="form-check-input border-success me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              const { checked } = e.target;
                              handleCheckboxClick(
                                subNode,
                                node.trackId,
                                checked
                              );
                            }}
                          />
                          <label htmlFor={`${subNode?.trackId}`}>
                            {subNode.label}
                          </label>
                        </>
                      )}
                    </td>

                    {subNode?.items?.length > 0 ? (
                      ""
                    ) : (
                      <td className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            id={`${subNode?._id}`}
                            checked={subNode?.isInserted}
                            className="form-check-input border-success me-2"
                            readOnly
                            onClick={(e) => {
                              const { checked } = e.target;
                              if (subNode.isChecked) {
                                handleCheckboxClickInsert(
                                  subNode,
                                  node.trackId,
                                  checked
                                );
                              } else {
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                return;
                              }
                            }}
                          />
                          <label htmlFor="">Insert</label>
                        </div>
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            checked={subNode?.isUpdated}
                            className="form-check-input border-success me-2"
                            readOnly
                            onClick={(e) => {
                              const { checked } = e.target;
                              if (subNode.isChecked) {
                                handleCheckboxClickUpdate(
                                  subNode,
                                  node.trackId,
                                  checked
                                );
                              } else {
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                return;
                              }
                            }}
                          />
                          <label htmlFor="">Update</label>
                        </div>
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            checked={subNode?.isRemoved}
                            className="form-check-input border-success me-2"
                            readOnly
                            onClick={(e) => {
                              const { checked } = e.target;
                              if (subNode.isChecked) {
                                handleCheckboxClickDelete(
                                  subNode,
                                  node.trackId,
                                  checked
                                );
                              } else {
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                return;
                              }
                            }}
                          />
                          <label htmlFor="">Delete</label>
                        </div>
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            checked={subNode?.isPDF}
                            className="form-check-input border-success me-2"
                            readOnly
                            onClick={(e) => {
                              const { checked } = e.target;
                              if (subNode.isChecked) {
                                handleCheckboxClickPDF(
                                  subNode,
                                  node.trackId,
                                  checked
                                );
                              } else {
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                return;
                              }
                            }}
                          />
                          <label htmlFor="">PDF</label>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TreeSingleUserNode;
