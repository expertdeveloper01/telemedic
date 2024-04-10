/***
 * Consult List for Patient
 */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import tableIcon from "../../containers/patient/services";
import { Link } from "react-router-dom";
// import queryString from "querystring";
// import Loader from "../components/Loader/loader";
// import Message from "../components/Message/Message";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";

import {
  patAppointments,
} from "../../redux/actions/AppointmentAction";
import {
  Button,
  Container,
} from "@mui/material";

import moment from "moment";

import MaterialTable from "material-table";
import tableIcons from "./services";

// import PatientListPaginate from "../components/PatientListPaginate";

function PatAppointmentlist({ history, location, match }) {
  // const userType = match.params.user;
  // dispatch for using action
  const dispatch = useDispatch();
  const patappointment = useSelector((state) => state.appointmentReducer);
  const { patappointments } = patappointment;

  console.log("....apppp", patappointments);
  // const { patappointments } = useSelector((state) => state.appointmentReducer);

  // get userInfo from state
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(patAppointments());
    if (!userInfo) {
      history.push("/");
    }
  }, [dispatch]);

  const [sortBy, setSortBy] = useState("consult_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isShown, setIsShown] = useState(false);

  // sorting
  const handleSort = (field, order = "desc") => {
    setSortBy(field);
    setSortOrder(order);
  };

  // columns to map
  const columns = [
    // { title: "ID", field: "_id" },
    { title: "S.No.", field: "sno" },
    { title: "FIRST NAME", field: "firstName" },

    { title: "DOB", field: "dob" },
    { title: "CREATED AT", field: "createdAt" },
    { title: "STATUS", field: "status" },
    {
      title: "APPOINTMENT DATE & TIME",
      field: "appointmentDateTime",
    },

    // {
    //   title: "CONVERSATION",
    //   field: "url",
    //   render: (rowData) => <i class="fa-solid fa-comments"></i>,
    // },
    // {
    //   title: "DETAILS",
    //   field: "url",
    //   render: (rowData) => <i class="fa-solid fa-eye"></i>,
    //   Tooltip: "Details",
    //   onClick: () => history.push("/appointment-details"),
    // },
    // {
    //   title: "ACTIONS",
    //   field: "url",
    //   render: (rowData) => (
    //     <Button onClick=  ()=>swal("Accepted")>
    //       <i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>
    //     </Button>
    //   ),
    // },
  ];
  // const data = [{ _id: "1", firstName: "Jill Dupre", dob: "02-02-2022" }];

  return (
    <>
      {/* {JSON.stringify(userInfo["timeZone"][0]["abbrevation"])}; */}
      <Container>
        <div className="row" style={{ textAlign: "right" }}>
          <Link to="/book-appointment">
            <Button>
              {" "}
              <i className="fa-solid fa-plus"></i>BOOK APPOINTMENT
            </Button>
          </Link>
        </div>
        <div className="row">
          {/* {JSON.stringify(patappointments)} */}
          <MaterialTable
            icons={tableIcons}
            title="Appointment List "
            columns={columns}
            // data={data}

            data={patappointments?.map(
              (
                {
                  _id,
                  patient,
                  createdAt,
                  firstName,
                  lastName,
                  email,
                  phoneNumber,
                  gender: Male,
                  timeZone,
                  height,
                  weight,
                  dob,
                  treatmentArea,
                  appointmentDateTime,
                  medicalHistory,
                  status,
                },
                index
              ) => ({
                // _id: _id.$oid,
                sno: index + 1,
                firstName,
                status,
                lastName,
                dob: moment(dob).format("DD-MM-yyyy"),
                // createdAt: JSON.stringify(userInfo.timeZone[0].abbrevation),
                createdAt: formatInTimeZone(
                  zonedTimeToUtc(createdAt, "UTC"),
                  userInfo?.timezoneData[0]?.abbrevation,
                  "dd-MM-yyyy hh:mm a"
                ),
                // createdAt: formatInTimeZone(
                //   zonedTimeToUtc(createdAt, "UTC"),
                //   userInfo?.timezoneData[0]?.abbrevation,
                //   "dd-MM-yyyy hh:mm a"
                // ),
                appointmentDateTime: formatInTimeZone(
                  zonedTimeToUtc(appointmentDateTime, "UTC"),
                  userInfo.timezoneData[0].abbrevation,
                  "dd-MM-yyyy hh:mm a"
                ),

                // appointmentDateTime: formatInTimeZone(
                //   zonedTimeToUtc(appointmentDateTime, "UTC"),
                //   userInfo.timezoneData[0].abbrevation,
                //   "dd-MM-yyyy hh:mm a"
                // ),
              })
            )}
            localization={{
              pagination: {
                // labelDisplayedRows: ["1-2"],
                labelRowsPerPage: false,
              },
              header: {
                actions: "ACTIONS",
              },
            }}
            style={{
              maxWidth: "2200px",
              margin: "20px",
              marginRight: "100%",
              border: "8px",
              textAlign: "center",
            }}
            options={{
              actionsColumnIndex: 5,
              // width: 150,
              headerStyle: {
                background: "#999",
                color: "#fff",
              },
              //  filtering: true,
            }}
            actions={[
              (rowData) => ({
                icon: () => (
                  <>
                    {rowData.status === "accepted" && (
                      <i
                        class="fa-solid fa-comments"
                        title="chat"
                        style={{ boxShadow: "none" }}
                      // hidden={rowData.status === "pending"}
                      ></i>
                    )}
                  </>
                ),

                //     // onClick: (e, data) => deleteHandler(data._id),
                //     // onClick: (e, data) => console.log(data._id)
              }),

              // console.log("abbbbbbb", userInfo?.timeZone.abbrevation),
              // console.log("hgsfdhagd", patappointments.createdAt),
            ]}
          />
        </div>
      </Container>
    </>

    // <div>
    //   <div className="container">
    //     <h5 style={{ color: "orange" }}>APPOINTMENT LIST</h5>
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "left",
    //         "& > *": {
    //           m: 1,
    //         },
    //       }}
    //     >
    //       <ButtonGroup variant="text" aria-label="text button group">
    //         <Button>Upcomming</Button>
    //         <Button>Past</Button>
    //       </ButtonGroup>
    //     </Box>
    //     <div style={{ textAlign: "right" }}>
    //       <Link to="/book-appointment" style={{ textDecoration: "none" }}>
    //         <Button className="my-3">
    //           <span style={{ color: "green" }}>
    //             <i className="fa-solid fa-plus"></i> Book Appointment
    //           </span>
    //         </Button>
    //       </Link>
    //     </div>

    //     <table
    //       className="table table-striped table-bordered table-sm"
    //       cellSpacing="0"
    //       fontSize="5px"
    //       // width="100%"
    //     >
    //       <thead>
    //         <tr>
    //           {/* mapping columns as follows */}
    //           {columns?.map(({ title, field }) => {
    //             return (
    //               <th key={title}>
    //                 <div style={{ display: "flex", flexDirection: "row" }}>
    //                   <div style={{ marginRight: 5 }}>{title}</div>
    //                   {field && (
    //                     <>
    //                       {/* sorting */}
    //                       <IconArrowNarrowUp
    //                         onClick={() => handleSort(field, "asc")}
    //                         size={18}
    //                         style={{
    //                           cursor: "pointer",
    //                           color:
    //                             sortBy === field && sortOrder === "asc"
    //                               ? "red"
    //                               : "black",
    //                         }}
    //                       />
    //                       <IconArrowNarrowDown
    //                         onClick={() => handleSort(field, "desc")}
    //                         size={18}
    //                         style={{
    //                           cursor: "pointer",
    //                           color:
    //                             sortBy === field && sortOrder === "desc"
    //                               ? "red"
    //                               : "black",
    //                         }}
    //                       />
    //                     </>
    //                   )}
    //                 </div>
    //               </th>
    //             );
    //           })}
    //         </tr>
    //       </thead>
    //       {/* {JSON.stringify(patappointments)} */}
    //       <tbody>
    //         {/* mapping appointments */}

    //         {patappointments?.map((appointment) => (
    //           <tr>
    //             <td>{appointment._id}</td>
    //             <td>17-02-2006</td>
    //             <td>{appointment.firstName}</td>
    //             <td>{appointment.lastName}</td>
    //             <td>{appointment.email}</td>
    //             <td>{appointment.phoneNumber}</td>
    //             <td>{appointment.country}</td>
    //             <td>{appointment.state}</td>
    //             <td>{appointment.city}</td>
    //             <td>{appointment.gender}</td>

    //             <td>{appointment.dob}</td>
    //             <td>{appointment.appointmentDateTime}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}
export default PatAppointmentlist;