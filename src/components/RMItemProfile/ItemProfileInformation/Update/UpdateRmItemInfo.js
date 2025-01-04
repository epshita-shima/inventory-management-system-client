import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InsertUnitInfoModal from "../../../UnitInformation/Insert/InsertUnitInfoModal";
import {
  faArrowAltCircleLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import swal from "sweetalert";

import { useGetAllItemUnitQuery } from "../../../../redux/features/itemUnitInfo/itemUnitInfoApi";
import { InputGroup, Form } from "react-bootstrap";
import {
  useGetSingleRMItemQuery,
  useUpdateRMItemInfoMutation,
} from "../../../../redux/features/iteminformation/rmItemInfoApi";
import { useGetAllCategoryInfoQuery } from "../../../../redux/features/categoryInfo/categoryInfoApi";
import InsertCategoryInformationModal from "../../../CategoryInformation/Insert/InsertCategoryInformationModal";
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";

const UpdateRmItemInfo = () => {
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const { id } = useParams();
  const [singleItemInfoData, setSingleItemInfoData] = useState();
  const { data: singleRMItemData ,isLoading:isLoadingUpdateRaw} = useGetSingleRMItemQuery(id);
  const { data: categoryInfoData } = useGetAllCategoryInfoQuery(undefined);
  const { data: itemUnitData } = useGetAllItemUnitQuery(undefined);
  const [updateRMItemInfoData,{isLoading}] = useUpdateRMItemInfoMutation();
  const navigate = useNavigate();
  const updatebyUser = getMakebyUser();

  useEffect(() => {
    setSingleItemInfoData(singleRMItemData);
  }, [singleRMItemData]);

  const categoryInfoConvertSelectOption = (options) => {
    let result = [];
    options?.forEach((option) => {
      result.push({
        value: option._id,
        label: option.categoryInfo,
      });
    });
    return result;
  };

  const categoryInfoConvertedOptions =
    categoryInfoConvertSelectOption(categoryInfoData);


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
      const response = await updateRMItemInfoData(singleItemInfoData);
      console.log(response.data.status);
      if (response.data.status === 200) {
        swal("Done", "Data Update Successfully", "success");
        navigate("/main-view/raw-material-item-list");
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
        overflowY: "scroll",
        height: "500px",
      }}
    >
      {
        <LoadingSpineer isLoading={isLoadingUpdateRaw}></LoadingSpineer>
      }
      <div class="overflow-hidden">
        <div className="shadow-lg mt-2 mt-sm-5 mt-md-5 mt-lg-5 p-5 rounded-4">
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
                Update (Raw Material) Item Info
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
                  // navigate('/main-view/menu-list')
                }}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
                Back to ItemList
              </button>
            </div>
          </div>
          <div></div>

          <div className="mt-3">
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
                        name="categoryinfo"
                        options={categoryInfoConvertedOptions}
                        value={categoryInfoConvertedOptions.find(
                          (x) => x.value == singleItemInfoData?.categoryId
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
                            categoryId: e.value,
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
                        data-target="#categoryInfoModal"
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
                  </div>
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
                 {isLoading ?'Updating' : 'Update' } 
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <InsertCategoryInformationModal></InsertCategoryInformationModal>
      <InsertUnitInfoModal></InsertUnitInfoModal>
    </div>
  );
};

export default UpdateRmItemInfo;
