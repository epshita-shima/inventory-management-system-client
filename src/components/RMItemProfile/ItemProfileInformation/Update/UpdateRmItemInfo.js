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
import getMakebyUser from "../../../Common/CommonMakeUser/CommonMakingUser";
import InsertCategoryInformationModal from "../../../CategoryInformation/Update/InsertCategoryInformationModal";
import "./UpdateRmItemInfo.css";
import "../../../../buttonStyle/style.css";
import { categoryInfoConvertSelectOption, itemUnitConvertSelectOption } from "../../../Common/CommonDropdown/CommonDropdown";

const UpdateRmItemInfo = () => {
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const { id } = useParams();
  const [singleItemInfoData, setSingleItemInfoData] = useState({});
  const { data: singleRMItemData, } =
    useGetSingleRMItemQuery(id);
  const { data: categoryInfoData } = useGetAllCategoryInfoQuery(undefined);
  const { data: itemUnitData } = useGetAllItemUnitQuery(undefined);
  const [updateRMItemInfoData, { isLoading }] = useUpdateRMItemInfoMutation();
  const navigate = useNavigate();
  const updatebyUser = getMakebyUser();

  useEffect(() => {
    setSingleItemInfoData(singleRMItemData);
  }, [singleRMItemData]);


  const categoryInfoConvertedOptions =
    categoryInfoConvertSelectOption(categoryInfoData);


  const itemUnitConvertedOptions = itemUnitConvertSelectOption(itemUnitData);

  const itemStatusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const cftPerDeclerationOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

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

  return (
    <div className="row px-4 mx-4">
      <div className="shadow-lg  p-5 rounded-4">
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
            <div className="d-block d-md-flex d-lg-flex d-xl-flex justify-content-center align-items-center w-100 ">
              <div className="card shadow-lg section-width p-0 p-md-5 p-lg-5 p-xl-5">
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
                              (x) => x.value === singleItemInfoData?.categoryId
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
                              (x) => x.value === singleItemInfoData?.unitId
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
                    <div className="col-sm-12 col-md-6 col-lg-4">
                      <Form.Label
                        htmlFor="inputPassword5"
                        style={{ color: "#032339", letterSpacing: "1px" }}
                      >
                        Item Status
                      </Form.Label>
                      <div className="d-flex justify-content-between">
                        <div className="w-100">
                          <Select
                            class="form-select"
                            className=" mb-3"
                            aria-label="Default select example"
                            name="categoryInfo"
                            options={itemStatusOptions}
                            value={itemStatusOptions.find(
                              (x) =>
                                String(x.value) ===
                                String(singleItemInfoData?.itemStatus)
                            )}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                                borderColor: state.isFocused ? "#fff" : "#fff",
                                border: "1px solid #2DDC1B",
                              }),
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                                height: "90px",
                                overflowY: "scroll",
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
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
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            onChange={(e) => {
                              setSingleItemInfoData((prevData) => ({
                                ...prevData,
                                itemStatus:e.value==="true"? true : false,
                                updateBy: updatebyUser,
                                updateDate: new Date(),
                              }));
                            }}
                          ></Select>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4">
                      <Form.Label
                        htmlFor="inputCft"
                        style={{ color: "#032339", letterSpacing: "1px" }}
                      >
                        CFT Dcleration
                      </Form.Label>
                      <div className="w-100 d-flex justify-content-between mt-2">
                        <div className="w-100">
                          <Select
                            class="form-select"
                            className=" mb-3"
                            aria-label="Default select example"
                            name="unitinfo"
                            options={cftPerDeclerationOptions}
                            value={cftPerDeclerationOptions.find(
                              (x) =>
                                String(x.value) ===
                                String(singleItemInfoData?.cftDeclaration)
                            )}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                                borderColor: state.isFocused ? "#fff" : "#fff",
                                border: "1px solid #2DDC1B",
                              }),
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                                height: "80px",
                                overflowY: "scroll",
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
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
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            onChange={(e) => {
                              setSingleItemInfoData((prevData) => ({
                                ...prevData,
                                cftDeclaration:e.value==="true"? true : false,
                                updateBy: updatebyUser,
                                updateDate: new Date(),
                              }));
                            }}
                          ></Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-4 w-100">
                  <button
                    type="submit"
                    form="itemcreation-form"
                    className="border-0  raw-submit-button"
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
