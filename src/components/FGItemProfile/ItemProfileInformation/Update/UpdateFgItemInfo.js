import React, { useEffect, useState } from "react";
import {
  useGetSingleItemQuery,
  useUpdateItemInfoMutation,
} from "../../../../redux/features/iteminformation/iteminfoApi";
import { useNavigate, useParams } from "react-router-dom";
import InsertItemSizeInfoModal from "../../../SizeInformation/Insert/InsertItemSizeInfoModal";
import InsertUnitInfoModal from "../../../UnitInformation/Insert/InsertUnitInfoModal";
import { Field, FieldArray, Formik } from "formik";
import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import { useGetAllItemSizeQuery } from "../../../../redux/features/itemsizeinfo/itemSizeInfoApi";
import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { InputGroup, Form } from "react-bootstrap";

const UpdateFgItemInfo = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { id } = useParams();
  const [singleItemInfoData, setSingleItemInfoData] = useState();
  const { data: singleItemData } = useGetSingleItemQuery(id);
  const { data: itemSize } = useGetAllItemSizeQuery(undefined);
  const { data: itemUnitData } = useGetAllItemUnitQuery(undefined);
  const [updateItemInfo] = useUpdateItemInfoMutation();
  const navigate = useNavigate();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const updatebyUser = getUserParse[0].username;
  console.log(id);
  console.log(singleItemInfoData);
  useEffect(() => {
    setSingleItemInfoData(singleItemData);
  }, [singleItemData]);

  const itemSizeConvertSelectOption = (options) => {
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.sizeInfo,
      });
    });
    return result;
  };

  const itemSizeConvertedOptions = itemSizeConvertSelectOption(itemSize);

  const itemUnitConvertSelectOption = (options) => {
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.unitInfo,
      });
    });
    return result;
  };

  const itemUnitConvertedOptions = itemUnitConvertSelectOption(itemUnitData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateItemInfo(singleItemInfoData);
      console.log(response.data.status);
      if (response.data.status === 200) {
        swal("Done", "Data Update Successfully", "success");
        navigate("/main-view/finish-goods-item-list");
      } else {
        swal(
          "Not Possible!",
          "An problem occurred while updating the data",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      swal("Relax!", "An problem occurred while updating the data", "error");
    }
  };

  return (
    <div
      className=" row px-4 mx-4"
      style={{
        overflowY: "hidden",
        height: "calc(100vh - 120px)",
      }}
    >
      <div class="">
        <div className="shadow-lg  p-5 rounded-4">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                style={{
                  fontSize: "14px",
                  color: "#000",
                  // backgroundColor: "#00B987",
                  backgroundColor: "#2DDC1B",
                  borderRadius: "50px",
                  padding: "3px",
                }}
                icon={faPlus}
              />
              &nbsp;
              <span
                style={{
                  color: "#000",
                  fontWeight: "700",
                  letterSpacing: ".5px",
                }}
              >
                Update Finish Goods Item Info
              </span>
            </div>
            <div>
              <button
                style={{
                  backgroundColor: "#E55566",
                  outline: "none",
                  border: "none",
                  color: "white",
                  height: "25px",
                }}
                onClick={() => {
                  navigate("/main-view/finish-goods-item-list");
                }}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
                Back to ItemList
              </button>
            </div>
          </div>
          <div></div>

          <div className="mt-3 table-responsive-custom">
            <Form
              id="itemcreation-form"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="d-flex justify-content-center align-items-center w-100 ">
                <div className="card shadow-lg w-50 p-5">
                  <Form.Label
                    htmlFor="inputPassword5"
                    style={{ color: "#032339", letterSpacing: "1px" }}
                  >
                    Item Name
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Username"
                      name="username"
                      required
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      value={singleItemInfoData?.itemName}
                      autoComplete="off"
                      onChange={(e) => {
                        setSingleItemInfoData((prevData) => ({
                          ...prevData,
                          itemName: e.target.value,
                          updateBy: updatebyUser,
                          updateDate: new Date(),
                        }));
                      }}
                      style={{
                        border: "1px solid #B8FEB3",
                        background: "white",
                      }}
                    />
                  </InputGroup>

                  <div className="w-100 d-flex justify-content-between mt-2">
                    <div className="w-100">
                      <Form.Label
                        htmlFor="inputPassword5"
                        style={{ color: "#032339", letterSpacing: "1px" }}
                      >
                        Size Info
                      </Form.Label>
                      <Select
                        class="form-select"
                        className=" mb-3"
                        aria-label="Default select example"
                        name="sizeinfo"
                        options={itemSizeConvertedOptions}
                        value={itemSizeConvertedOptions.find(
                          (x) => x.value == singleItemInfoData?.sizeId
                        )}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? "#fff" : "#fff",
                            border: "1px solid #2DDC1B",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                            height: "200px",
                            overflowY: "scroll",
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#B8FEB3",
                            primary: "#2DDC1B",
                          },
                        })}
                        onChange={(e) => {
                          setSingleItemInfoData((prevData) => ({
                            ...prevData,
                            sizeId: e.value,
                            updateBy: updatebyUser,
                            updateDate: new Date(),
                          }));
                        }}
                      ></Select>
                    </div>
                    <div className="ms-2 mt-5">
                      <FontAwesomeIcon
                        className="border align-middle text-center p-2 fs-3 rounded-5 text-light"
                        style={{
                          background: "#2DDC1B",
                        }}
                        icon={faPlus}
                        data-toggle="modal"
                        data-target="#exampleModal1"
                      />
                    </div>
                  </div>

                  <div className="w-100 d-flex justify-content-between mt-2">
                    <div className="w-100">
                      <Form.Label
                        htmlFor="inputPassword5"
                        style={{ color: "#032339", letterSpacing: "1px" }}
                      >
                        Unit Info
                      </Form.Label>
                      <Select
                        class="form-select"
                        className=" mb-3"
                        aria-label="Default select example"
                        name="unitinfo"
                        options={itemUnitConvertedOptions}
                        value={itemUnitConvertedOptions.find(
                          (x) => x.value == singleItemInfoData?.unitId
                        )}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? "#fff" : "#fff",
                            border: "1px solid #2DDC1B",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // Increase the z-index value here
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#B8FEB3",
                            primary: "#2DDC1B",
                          },
                        })}
                        onChange={(e) => {
                          setSingleItemInfoData((prevData) => ({
                            ...prevData,
                            unitId: e.value,
                            updateBy: updatebyUser,
                            updateDate: new Date(),
                          }));
                        }}
                      ></Select>
                    </div>
                    <div className="ms-2 mt-5">
                      <FontAwesomeIcon
                        className="border align-middle text-center p-2 fs-3 rounded-5 text-light"
                        style={{
                          background: "#2DDC1B",
                        }}
                        icon={faPlus}
                        data-toggle="modal"
                        data-target="#exampleModal3"
                      />
                    </div>
                  </div>
                  <Form.Label
                    htmlFor="inputPassword5"
                    style={{ color: "#032339", letterSpacing: "1px" }}
                  >
                    Opening Stock Date
                  </Form.Label>
                  <div className="mb-2">
                    <DatePicker
                      dateFormat="y-MM-dd"
                      className="text-center custom-datepicker-update"
                      calendarClassName="custom-calendar"
                      selected={singleItemInfoData?.openingDate}
                      value={singleItemInfoData?.openingDate}
                      required
                      onChange={(startDate) => {
                        console.log(startDate);
                        if (startDate > new Date()) {
                          swal({
                            title: "Select Valid Date",
                            text: "Date should be equal or earlier than today",
                            icon: "warning",
                            button: "OK",
                          });
                        } else {
                          setStartDate(startDate.toLocaleDateString("en-CA"));
                          setSingleItemInfoData((prevData) => ({
                            ...prevData,
                            openingDate: startDate.toLocaleDateString("en-CA"),
                            updateBy: updatebyUser,
                            updateDate: new Date(),
                          }));
                        }
                      }}
                    />
                  </div>
                  <Form.Label
                    htmlFor="inputPassword5"
                    style={{ color: "#032339", letterSpacing: "1px" }}
                  >
                    Opening Stock
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="opening-stock"
                      required
                      aria-label="Recipient's opening stock"
                      aria-describedby="basic-addon2"
                      value={singleItemInfoData?.openingStock}
                      autoComplete="off"
                      onChange={(e) => {
                        setSingleItemInfoData((prevData) => ({
                          ...prevData,
                          openingStock: e.target.value,
                          updateBy: updatebyUser,
                          updateDate: new Date(),
                        }));
                      }}
                      style={{
                        border: "1px solid #B8FEB3",
                        background: "white",
                      }}
                    />
                  </InputGroup>
                  <Form.Label
                    htmlFor="inputPassword5"
                    style={{ color: "#032339", letterSpacing: "1px" }}
                  >
                   Production Qty(Per Batch)
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="productionQtyPerBatch"
                      required
                      aria-label="Recipient's production qty per batch"
                      aria-describedby="basic-addon2"
                      value={singleItemInfoData?.productionQtyPerBatch}
                      autoComplete="off"
                      onChange={(e) => {
                        setSingleItemInfoData((prevData) => ({
                          ...prevData,
                          productionQtyPerBatch: e.target.value,
                          updateBy: updatebyUser,
                          updateDate: new Date(),
                        }));
                      }}
                      style={{
                        border: "1px solid #B8FEB3",
                        background: "white",
                      }}
                    />
                  </InputGroup>
                  {/* <Form.Label
                    htmlFor="inputPassword5"
                    style={{ color: "#032339", letterSpacing: "1px" }}
                  >
                    Item Status
                  </Form.Label>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      checked={singleItemInfoData?.itemStatus}
                      id="flexCheckDefault"
                      onClick={(e) => {
                        setSingleItemInfoData((prevData) => ({
                          ...prevData,
                          itemStatus: e.target.checked,
                          updateBy: updatebyUser,
                          updateDate: new Date(),
                        }));
                      }}
                    />
                  </div> */}
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-4 w-100">
                <button
                  type="submit"
                  form="itemcreation-form"
                  className="border-0 "
                  style={{
                    backgroundColor: "#2DDC1B",
                    color: "white",
                    padding: "5px 10px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    width: "20%",
                  }}
                >
                  Save
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <InsertItemSizeInfoModal></InsertItemSizeInfoModal>
      <InsertUnitInfoModal></InsertUnitInfoModal>
    </div>
  );
};

export default UpdateFgItemInfo;
