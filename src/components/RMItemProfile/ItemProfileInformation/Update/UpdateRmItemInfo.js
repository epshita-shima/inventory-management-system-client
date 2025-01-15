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
import LoadingSpineer from "../../../Common/LoadingSpinner/LoadingSpineer";
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";
import InsertCategoryInformationModal from "../../../CategoryInformation/Update/InsertCategoryInformationModal";
import "./UpdateRmItemInfo.css";
import "../../../../buttonStyle/style.css";
const UpdateRmItemInfo = () => {
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const { id } = useParams();
  const [singleItemInfoData, setSingleItemInfoData] = useState();
  const { data: singleRMItemData, isLoading: isLoadingUpdateRaw } =
    useGetSingleRMItemQuery(id);
  const { data: categoryInfoData } = useGetAllCategoryInfoQuery(undefined);
  const { data: itemUnitData } = useGetAllItemUnitQuery(undefined);
  const [updateRMItemInfoData, { isLoading }] = useUpdateRMItemInfoMutation();
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
  console.log({ singleItemInfoData });
  return (
    <div className="row px-4 mx-4">
      {<LoadingSpineer isLoading={isLoadingUpdateRaw}></LoadingSpineer>}
      <div class="shadow-lg  p-5 rounded-4">
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center">
            <span
              style={{
                color: "#000",
                fontWeight: "700",
                letterSpacing: ".5px",
                fontSize: "20px",
              }}
            >
              Update (Raw Material) Item Info
            </span>
          </div>
          <div>
            <button
              className="customBackToListButton"
              onClick={() => {
                navigate("/main-view/raw-material-item-list");
              }}
            >
              <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
              Back to ItemList
            </button>
          </div>
        </div>

        <div className="mt-3 table-responsive-custom">
          <Form
            id="itemcreation-form"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="d-flex justify-content-center align-items-center w-100 ">
              <div className="card shadow-lg w-75 p-5">
                <div className="col-md-12">
                  <div className="row row-cols-1 row-cols-lg-3">
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
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
                            border: "1px solid #2DDC1B",
                            background: "white",
                            borderRadius: "5px",
                            height: "35px",
                          }}
                        />
                      </InputGroup>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
                      <div className="w-100 d-flex justify-content-between ">
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
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
                      <div className="w-100 d-flex justify-content-between">
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
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
                      <Form.Label
                        htmlFor="inputPassword5"
                        style={{ color: "#032339", letterSpacing: "1px" }}
                      >
                        Opening Stock Date
                      </Form.Label>
                      <div className="mb-2">
                        <DatePicker
                          dateFormat="y-MM-dd"
                          className="text-center custom-datepicker-rmItem"
                          calendarClassName="custom-calendar"
                          selected={singleItemInfoData?.openingDate}
                          value={singleItemInfoData?.openingDate}
                          required
                          onChange={(startDate) => {
                            if (startDate > new Date()) {
                              swal({
                                title: "Select Valid Date",
                                text: "Date should be equal or earlier than today",
                                icon: "warning",
                                button: "OK",
                              });
                            } else {
                              setStartDate(
                                startDate.toLocaleDateString("en-CA")
                              );
                              setSingleItemInfoData((prevData) => ({
                                ...prevData,
                                openingDate:
                                  startDate.toLocaleDateString("en-CA"),
                                updateBy: updatebyUser,
                                updateDate: new Date(),
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
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
                            border: "1px solid #2DDC1B",
                            background: "white",
                            borderRadius: "5px",
                            height: "35px",
                          }}
                        />
                      </InputGroup>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mt-4">
                      <Form.Label
                        htmlFor="inputPassword5"
                        style={{ color: "#032339", letterSpacing: "1px" }}
                      >
                        Item Status
                      </Form.Label>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexCheckDefault"
                          checked={singleItemInfoData?.itemStatus}
                          onChange={(e) => {
                            console.log(e.target.checked);
                            setSingleItemInfoData((prevData) => ({
                              ...prevData,
                              itemStatus: e.target.checked,
                              updateBy: updatebyUser,
                              updateDate: new Date(),
                            }));
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          {singleItemInfoData?.itemStatus
                            ? "Active"
                            : "Inactive"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 
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
                <div className="d-flex justify-content-center align-items-center mt-4 w-100">
                  <button
                    type="submit"
                    form="itemcreation-form"
                    className="border-0 "
                    style={{
                      backgroundColor: "#2DDC1B",
                      color: "white",
                      padding: "7px 10px",
                      fontSize: "14px",
                      borderRadius: "5px",
                      width: "20%",
                    }}
                  >
                    {isLoading ? "Updating" : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <InsertCategoryInformationModal></InsertCategoryInformationModal>
      <InsertUnitInfoModal></InsertUnitInfoModal>
    </div>
  );
};

export default UpdateRmItemInfo;
