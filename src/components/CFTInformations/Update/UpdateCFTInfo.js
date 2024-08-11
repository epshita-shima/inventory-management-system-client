/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  faArrowAltCircleLeft,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Field, ErrorMessage, FieldArray, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  useGetSingleCFTInfoQuery,
  useUpdateCFTInfoMutation,
} from "../../../redux/features/cftinformation/cftInfosApi";
import { useGetAllRMItemInformationQuery } from "../../../redux/features/iteminformation/rmItemInfoApi";
import { rawMaterialItemDropdown } from "../../Common/CommonDropdown/CommonDropdown";

const UpdateCFTInfo = () => {
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [finishDate, setFinishDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [singleCFTInfosData, setSingleCFTInfosData] = useState();
  const { data: singleCFTInfoData } = useGetSingleCFTInfoQuery(id);
  const { data: itemInfo } = useGetAllRMItemInformationQuery(undefined);
  const [updateCFTInfoData] = useUpdateCFTInfoMutation();
  const navigate = useNavigate();
  const getUser = localStorage.getItem("user");
  const getUserParse = JSON.parse(getUser);
  const updatebyUser = getUserParse[0].username;

  console.log(singleCFTInfosData);
  const rawMaterialItemOptions = rawMaterialItemDropdown(itemInfo);
  useEffect(() => {
    if (singleCFTInfoData) {
      setSingleCFTInfosData({
        _id: singleCFTInfoData._id,
        openingDate: singleCFTInfoData.openingDate,
        detailsData: singleCFTInfoData.detailsData,
        isActive: singleCFTInfoData.isActive,
        closingDate: singleCFTInfoData.closingDate,
        makeBy: singleCFTInfoData.makeBy,
        makeDate: singleCFTInfoData.makeDate,
        updateBy: singleCFTInfoData.updateBy,
        updateDate: singleCFTInfoData.updateDate,
      });
    }
    setSingleCFTInfosData(singleCFTInfoData);
  }, [singleCFTInfoData]);

  const handleKeyUp = (e, index, detail) => {
    const inputValue = e.target.value;

    setSingleCFTInfosData((prev) => {
      const temp_details = [...prev.detailsData];
      const newDetail = { ...temp_details[index] };
      newDetail["cftPerKg"] = inputValue;
      temp_details[index] = newDetail;
      return {
        ...prev,
        detailsData: [...temp_details],
        updateBy: updatebyUser,
        updateDate: new Date(),
      };
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileURL = reader.result;
  
        setSingleCFTInfosData((prev) => {
          const temp_details = [...prev.detailsData];
          const newDetail = { ...temp_details[index] };
          newDetail.image = fileURL; // Use file URL for preview
          newDetail.file = file; // Keep the actual file for further use
          temp_details[index] = newDetail;
          return {
            ...prev,
            detailsData: [...temp_details],
            updateBy: updatebyUser,
            updateDate: new Date(),
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", file);
    data.append("_id", singleCFTInfosData._id);
    data.append("openingDate", singleCFTInfosData.openingDate);
    data.append("isActive", singleCFTInfosData.isActive);
    data.append("makeBy", singleCFTInfosData.makeBy);
    data.append("makeDate", singleCFTInfosData.makeDate);
    data.append("updateBy", singleCFTInfosData.updateBy);
    data.append("updateDate", singleCFTInfosData.updateDate);
    data.append("closingDate", singleCFTInfosData.closingDate);
    data.append("kgPerUnit", singleCFTInfosData.kgPerUnit);
    data.delete(singleCFTInfosData.image);
    console.log(singleCFTInfosData?._id);

    try {
      const response = await updateCFTInfoData({ data, id });
      console.log(response.data.status);
      if (response.data.status === 200) {
        swal("Done", "Data Update Successfully", "success");
        navigate("/main-view/cft-info-list");
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
        height: "calc(98vh - 120px)",
      }}
    >
      <div class="overflow-hidden">
        <div className="shadow-lg p-5 rounded-4">
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
                Update  CFT Info
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
                  navigate("/main-view/cft-info-list");
                }}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
                Back to ItemList
              </button>
            </div>
          </div>
          <div></div>

          <div className="mt-3">
            <Formik
              initialValues={singleCFTInfosData}
              validationSchema={Yup.object({
                detailsData: Yup.array().of(
                  Yup.object().shape({
                    itemId: Yup.string().required("Required"),
                    cftPerKg: Yup.string().required("Required"),
                  })
                ),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                resetForm({ values: singleCFTInfosData });
                setSubmitting(false);
              }}
            >
              {({
                values,
                resetForm,
                setFieldValue,
                isSubmitting,
                errors,
                touched,
                isValid,
                dirty,
              }) => (
                <Form
                  id="itemcreation-form"
                  onSubmit={(e) => {
                    handleSubmit(e, values, resetForm);
                  }}
                >
                  <div className="d-lg-flex justify-content-between align-items-center">
                    <div className="mt-2 mb-4">
                      <label htmlFor="">Opening Date</label>
                      <DatePicker
                        dateFormat="y-MM-dd"
                        className="text-center custom-datepicker ms-2"
                        value={singleCFTInfosData?.OpeningDate}
                        calendarClassName="custom-calendar"
                        selected={startDate}
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
                            setStartDate(startDate.toLocaleDateString("en-CA"));
                            setSingleCFTInfosData((prevData) => ({
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
                    <div className="mt-2 mb-4">
                      <label htmlFor="">Closing Date</label>
                      <DatePicker
                        dateFormat="y-MM-dd"
                        className="text-center custom-datepicker ms-2"
                        value={
                          singleCFTInfosData?.closingDate !== ""
                            ? singleCFTInfosData?.closingDate
                            : finishDate
                        }
                        calendarClassName="custom-calendar"
                        selected={finishDate}
                        required
                        onChange={(finishDate) => {
                          if (finishDate > new Date()) {
                            swal({
                              title: "Select Valid Date",
                              text: "Date should be equal or earlier than today",
                              icon: "warning",
                              button: "OK",
                            });
                          } else {
                            console.log(finishDate);
                            setFinishDate(
                              finishDate.toLocaleDateString("en-CA")
                            );
                            setSingleCFTInfosData((prevData) => ({
                              ...prevData,
                              closingDate:
                                finishDate.toLocaleDateString("en-CA"),
                              updateBy: updatebyUser,
                              updateDate: new Date(),
                            }));
                          }
                        }}
                      />
                    </div>
                    <div className="d-flex mt-2 mb-4">
                      <button
                        type="submit"
                        form="itemcreation-form"
                        className="border-0 "
                        style={{
                          backgroundColor:
                            isValid && dirty ? "#2DDC1B" : "gray",
                          color: "white",
                          padding: "5px 10px",
                          fontSize: "14px",
                          borderRadius: "5px",
                          width: "100px",
                        }}
                        disabled={!(isValid && dirty)}
                      >
                        Save
                      </button>

                      <div
                        className="border-0 "
                        style={{
                          // backgroundColor: "#00B987",
                          backgroundColor: "#2DDC1B",
                          color: "black",
                          padding: "5px 10px",
                          fontSize: "14px",
                          borderRadius: "5px",
                          marginLeft: "5px",
                        }}
                        onClick={(i) => {
                          setSingleCFTInfosData((prev) => {
                            const temp__details = [...prev.detailsData];
                            temp__details.push({
                              itemId: "",
                              cftperkg: "",
                              image: "",
                            });
                            return {
                              ...prev,
                              detailsData: [...temp__details],
                            };
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add
                        Row
                      </div>
                    </div>
                  </div>
                  <FieldArray
                    name="detailsData"
                    render={(arrayHelpers) => {
                      const details = singleCFTInfosData?.detailsData;
                      console.log(details);
                      return (
                        <div
                          className=" flex-1 items-center d-flex-nowrap py-2"
                          // style={{height: "calc(75vh - 120px)", overflowY: "auto" }}
                        >
                          <div class="container-fluid">
                            <div class="row justify-content-center">
                              <div class="col-12 col-md-12 col-lg-12 fixed-column py-2">
                                <div class="table-responsive table-responsive-custom">
                                  <table className="table w-full table-bordered">
                                    <thead className="w-100">
                                      <tr>
                                        <th className="bg-white text-center align-middle  ">
                                          Sl
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          Item Name
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          CFT Per Kg
                                          <span className="text-danger fw-bold fs-2">
                                            *
                                          </span>
                                        </th>

                                        <th className="bg-white text-center align-middle ">
                                          Upload Image
                                        </th>
                                        <th className="bg-white text-center align-middle ">
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {details && details.length > 0
                                        ? details.map((detail, index) => {
                                            return (
                                              <tr key={index}>
                                                <td className="text-center align-middle">
                                                  {index + 1}
                                                </td>
                                                <td>
                                                  <div className="w-100 d-flex justify-content-between mt-2">
                                                    <div className="w-100">
                                                      <Select
                                                        class="form-select"
                                                        className="w-100 mb-3"
                                                        aria-label="Default select example"
                                                        // name={`detailsData?.${index}.itemId`}
                                                        options={
                                                          rawMaterialItemOptions
                                                        }
                                                        defaultValue={{
                                                          label: "Select Item",
                                                          value: 0,
                                                        }}
                                                       
                                                        value={rawMaterialItemOptions.find(
                                                          (x) =>
                                                            x.value ===
                                                            detail.itemId
                                                        )}
                                                        styles={{
                                                          control: (
                                                            baseStyles,
                                                            state
                                                          ) => ({
                                                            ...baseStyles,
                                                            width: "100%",
                                                            borderColor:
                                                              state.isFocused
                                                                ? "#fff"
                                                                : "#fff",
                                                            border:
                                                              "1px solid #2DDC1B",
                                                          }),
                                                          menu: (provided) => ({
                                                            ...provided,
                                                            zIndex: 9999,
                                                            // height:'200px',
                                                            //  overflowY:'scroll'
                                                          }),
                                                        }}
                                                        theme={(theme) => ({
                                                          ...theme,
                                                          colors: {
                                                            ...theme.colors,
                                                            primary25:
                                                              "#B8FEB3",
                                                            primary: "#2DDC1B",
                                                          },
                                                        })}
                                                        onChange={(e) => {
                                                          setSingleCFTInfosData(
                                                            (prev) => {
                                                              const temp_details =
                                                                [
                                                                  ...prev.detailsData,
                                                                ];
                                                              const newDetail =
                                                                {
                                                                  ...temp_details[
                                                                    index
                                                                  ],
                                                                };
                                                              newDetail[
                                                                "itemId"
                                                              ] = e.value;
                                                              temp_details[
                                                                index
                                                              ] = newDetail;
                                                              return {
                                                                ...prev,
                                                                detailsData: [
                                                                  ...temp_details,
                                                                ],
                                                                updateBy:
                                                                  updatebyUser,
                                                                updateDate:
                                                                  new Date(),
                                                              };
                                                            }
                                                          );
                                                        }}
                                                      ></Select>

                                                      {touched.detailsData?.[
                                                        index
                                                      ]?.sizeId &&
                                                        errors.detailsData?.[
                                                          index
                                                        ]?.sizeId && (
                                                          <div className="text-danger">
                                                            {
                                                              errors
                                                                .detailsData[
                                                                index
                                                              ].sizeId
                                                            }
                                                          </div>
                                                        )}
                                                    </div>
                                                    <div className="ms-2 mt-2">
                                                      <FontAwesomeIcon
                                                        className="border align-middle text-center p-2 fs-3 rounded-5 text-light "
                                                        style={{
                                                          background: "#2DDC1B",
                                                        }}
                                                        icon={faPlus}
                                                        data-toggle="modal"
                                                        data-target="#exampleModal1"
                                                      />
                                                    </div>
                                                  </div>
                                                </td>

                                                <td className="text-center align-middle">
                                                  <Field
                                                    type="text"
                                                    name={`detailsData.${index}.cftPerKg`}
                                                    placeholder="CFT Per Kg"
                                                    value={detail?.cftPerKg}
                                                    style={{
                                                      border:
                                                        "1px solid #2DDC1B",
                                                      padding: "4px",
                                                      width: "95%",
                                                      height: "38px",
                                                      borderRadius: "5px",
                                                      textAlign: "center",
                                                    }}
                                                    onChange={(e) => {
                                                      handleKeyUp(
                                                        e,
                                                        index,
                                                        detail
                                                      );
                                                    }}
                                                  />
                                                  <br />
                                                  <span className="text-danger">
                                                    <ErrorMessage
                                                      name={`detailsData.${index}.menu_name`}
                                                    />
                                                  </span>
                                                </td>
                                                <td className="text-center d-flex justify-content-center align-items-center border-0">
  <div className="d-flex">
    <input
      type="file"
      onChange={(e) => handleFileChange(e, index)}
    />
    {detail?.image && (
      <p>
        <img
          src={detail.image} // Use the file URL for preview
          alt="Current CFT Image"
          style={{
            maxWidth: "100px",
            maxHeight: "50px",
          }}
        />
        <span>{detail.file?.name}</span> {/* Display file name */}
      </p>
     
    )}
  </div>
</td>
                                                <td className="text-center align-middle">
                                                  <button
                                                    type="button"
                                                    className=" border-0 rounded  bg-transparent"
                                                    onClick={() => {
                                                      setSingleCFTInfosData(
                                                        (prev) => {
                                                          const temp__details =
                                                            [
                                                              ...prev.detailsData,
                                                            ];
                                                          if (
                                                            temp__details.length
                                                          )
                                                            temp__details.splice(
                                                              index,
                                                              1
                                                            );
                                                          return {
                                                            ...prev,
                                                            detailsData: [
                                                              ...temp__details,
                                                            ],
                                                            updateBy:
                                                              updatebyUser,
                                                            updateDate:
                                                              new Date(),
                                                          };
                                                        }
                                                      );
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faXmarkCircle}
                                                      className="text-danger fs-1"
                                                    ></FontAwesomeIcon>
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })
                                        : null}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div
  //     className=" row px-4 mx-4"
  //     style={{
  //       overflowY: "scroll",
  //       height: "500px",
  //     }}
  //   >
  //     <div class="overflow-hidden">
  //       <div className="shadow-lg mt-2 mt-sm-5 mt-md-5 mt-lg-5 p-5 rounded-4">
  //         <div className="d-flex justify-content-between align-items-center ">
  //           <div className="d-flex align-items-center">
  //             <FontAwesomeIcon
  //               style={{
  //                 fontSize: "14px",
  //                 color: "#000",
  //                 // backgroundColor: "#00B987",
  //                 backgroundColor: "#2DDC1B",
  //                 borderRadius: "50px",
  //                 padding: "3px",
  //               }}
  //               icon={faPlus}
  //             />
  //             &nbsp;
  //             <span
  //               style={{
  //                 color: "#000",
  //                 fontWeight: "700",
  //                 letterSpacing: ".5px",
  //               }}
  //             >
  //               Update CFT Info
  //             </span>
  //           </div>
  //           <div>
  //             <button
  //               style={{
  //                 backgroundColor: "#E55566",
  //                 outline: "none",
  //                 border: "none",
  //                 color: "white",
  //                 height: "25px",
  //               }}
  //               onClick={() => {
  //                 navigate("/main-view/cft-info-list");
  //               }}
  //             >
  //               <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>{" "}
  //               Back to CFTinfoList
  //             </button>
  //           </div>
  //         </div>
  //         <div></div>

  //         <div className="mt-3">
  //           <Form
  //             id="itemcreation-form"
  //             onSubmit={(e) => {
  //               handleSubmit(e);
  //             }}
  //           >
  //             <div className="d-flex justify-content-center align-items-center w-100 ">
  //               <div className="card shadow-lg w-50 p-5">
  //                 <Form.Label
  //                   htmlFor="inputPassword5"
  //                   style={{ color: "#032339", letterSpacing: "1px" }}
  //                 >
  //                   Opening Date
  //                 </Form.Label>
  //                 <div className="mb-2">
  //                   <DatePicker
  //                     dateFormat="y-MM-dd"
  //                     className="text-center custom-datepicker-update"
  //                     calendarClassName="custom-calendar"
  //                     selected={singleCFTInfosData?.openingDate}
  //                     value={singleCFTInfosData?.openingDate}
  //                     required
  //                     onChange={(startDate) => {
  //                       console.log(startDate);
  //                       if (startDate > new Date()) {
  //                         swal({
  //                           title: "Select Valid Date",
  //                           text: "Date should be equal or earlier than today",
  //                           icon: "warning",
  //                           button: "OK",
  //                         });
  //                       } else {
  //                         setStartDate(startDate.toLocaleDateString("en-CA"));
  //                         setSingleCFTInfosData((prevData) => ({
  //                           ...prevData,
  //                           openingDate: startDate.toLocaleDateString("en-CA"),
  //                           updateBy: updatebyUser,
  //                           updateDate: new Date(),
  //                         }));
  //                       }
  //                     }}
  //                   />
  //                 </div>
  //                 <Form.Label
  //                   htmlFor="inputPassword5"
  //                   style={{ color: "#032339", letterSpacing: "1px" }}
  //                 >
  //                   Closing Date
  //                 </Form.Label>
  //                 <div className="mb-2">
  //                   <DatePicker
  //                     dateFormat="y-MM-dd"
  //                     className="text-center custom-datepicker-update"
  //                     calendarClassName="custom-calendar"
  //                     selected={singleCFTInfosData?.closingDate}
  //                     value={
  //                       singleCFTInfosData?.closingDate
  //                         ? singleCFTInfosData?.closingDate
  //                         : startDate
  //                     }
  //                     required
  //                     onChange={(startDate) => {
  //                       console.log(startDate);
  //                       if (startDate > new Date()) {
  //                         swal({
  //                           title: "Select Valid Date",
  //                           text: "Date should be equal or earlier than today",
  //                           icon: "warning",
  //                           button: "OK",
  //                         });
  //                       } else {
  //                         setStartDate(startDate.toLocaleDateString("en-CA"));
  //                         setSingleCFTInfosData((prevData) => ({
  //                           ...prevData,
  //                           closingDate: startDate.toLocaleDateString("en-CA"),
  //                           isActive: false,
  //                           updateBy: updatebyUser,
  //                           updateDate: new Date(),
  //                         }));
  //                       }
  //                     }}
  //                   />
  //                 </div>
  //                 <Form.Label
  //                   htmlFor="inputPassword5"
  //                   style={{ color: "#032339", letterSpacing: "1px" }}
  //                 >
  //                   CFT per KG
  //                 </Form.Label>
  //                 <InputGroup className="mb-3">
  //                   <Form.Control
  //                     placeholder="cft per kg"
  //                     name="kgperunit"
  //                     required
  //                     aria-label="cft per kg"
  //                     aria-describedby="basic-addon2"
  //                     value={singleCFTInfosData?.kgPerUnit}
  //                     autoComplete="off"
  //                     onChange={(e) => {
  //                       setSingleCFTInfosData((prevData) => ({
  //                         ...prevData,
  //                         kgPerUnit: e.target.value,
  //                         updateBy: updatebyUser,
  //                         updateDate: new Date(),
  //                       }));
  //                     }}
  //                     style={{
  //                       border: "1px solid #B8FEB3",
  //                       background: "white",
  //                       zIndex: "0",
  //                     }}
  //                   />
  //                 </InputGroup>
  //                 <div className="mt-2">
  //                   <label htmlFor="">Upload Image</label>
  //                   <div className="d-flex">
  //                     <input type="file" onChange={handleFileChange} />
  //                     {singleCFTInfoData?.image ? (
  //                       <p>
  //                         <img
  //                           src={`${process.env.REACT_APP_BASE_URL}/${singleCFTInfoData?.image}`}
  //                           alt="Current CFT Image"
  //                           style={{ maxWidth: "100px", maxHeight: "50px" }}
  //                         />
  //                       </p>
  //                     ) : (
  //                       singleCFTInfoData?.image && (
  //                         <div>
  //                           <p>Current Image:</p>
  //                           <img
  //                             src={`${process.env.REACT_APP_BASE_URL}/${singleCFTInfoData?.image}`}
  //                             alt="Current CFT Image"
  //                             style={{ maxWidth: "100px", maxHeight: "50px" }}
  //                           />
  //                         </div>
  //                       )
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="d-flex justify-content-center align-items-center mt-4 w-100">
  //               <button
  //                 type="submit"
  //                 form="itemcreation-form"
  //                 className="border-0 "
  //                 style={{
  //                   backgroundColor: "#2DDC1B",
  //                   color: "white",
  //                   padding: "5px 10px",
  //                   fontSize: "14px",
  //                   borderRadius: "5px",
  //                   width: "20%",
  //                 }}
  //               >
  //                 Update
  //               </button>
  //             </div>
  //           </Form>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default UpdateCFTInfo;
