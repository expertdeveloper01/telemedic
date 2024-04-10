import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import { docAppointments } from "../../redux/actions/AppointmentAction";
import { Button, Container } from "@mui/material";
import Loader from "../../components/Loader/loader";
import MaterialTable from "material-table";
import tableIcons from "./services";
import moment from "moment";
import Message from "../../components/Message/Message";
import { appointmentAcceptDoc } from "../../redux/actions/AppointmentAction";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

function Appointmentlist({ history, location, match }) {
  // dispatch for using action
  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();

  const doctorappointment = useSelector((state) => state.appointmentReducer);
  const { docappointments, loading, error } = doctorappointment;

  const appointmentaccept = useSelector(
    (state) => state.DocAppointmentAcceptReducer
  );
  const { loading: acceptLoading } = appointmentaccept;

  console.log("....apppp", docappointments);

  // get userInfo from state
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(docAppointments());
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  // handleAccept function
  const handleAccept = async (_id) => {
    const status = await dispatch(appointmentAcceptDoc(_id));
    console.log("accepted action");
    setSuccessMessage("Appointed Accepted");
  };


  // columns to map
  const columns = [
    { title: "S.No.", field: "sno" },
    { title: "FIRST NAME", field: "firstName" },

    { title: "DOB", field: "dob" },
    { title: "CREATED AT", field: "createdAt" },
    // { title: "status", field: "status" },

    {
      title: "APPOINTMENT DATE & TIME",
      field: "appointmentDateTime",
    },
    // {
    //   title: "CHAT",
    //   field: "url",
    //   render: (rowData) => (
    //     <Link to="/">
    //       <i class="fa-solid fa-comments"></i>
    //     </Link>
    //   ),
    // },
    // {
    //   title: "PRESCRIPTION",
    //   field: "url",
    //   render: (rowData) => (
    //     <Link to="/">
    //       <i class="fa-solid fa-file-circle-plus"></i>
    //     </Link>
    //   ),
    // },
    // {
    //   title: "DETAILS",
    //   field: "url",
    //   render: (rowData) => (
    //     <Link to="/appointment-details">
    //       <i class="fa-solid fa-eye"></i>
    //     </Link>
    //   ),
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
  // const data = {  1,  abcb, dob: "02-02-2022" };
  return (
    <Container>
      {loading ? (
        <Loader />
      ) : acceptLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {" "}
          <Dialog
            open={!!successMessage}
            onClose={() => {
              setSuccessMessage(null);
              window.location.reload();
            }}
          >
            <DialogTitle>{successMessage}</DialogTitle>
            <DialogActions>
              <Button
                onClick={() => {
                  setSuccessMessage(null);
                  window.location.reload();
                }}
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <div className="row">
            <MaterialTable
              icons={tableIcons}
              title="Appointment List "
              columns={columns}
              // data={data}
              data={docappointments?.map(
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
                  _id,
                  sno: index + 1,
                  firstName,
                  lastName,
                  dob: moment(dob).format("DD-MM-yyyy"),

                  createdAt: formatInTimeZone(
                    zonedTimeToUtc(createdAt, "UTC"),
                    userInfo?.timezoneData[0]?.abbrevation,
                    "dd-MM-yyyy hh:mm a"
                  ),
                  // appointmentDateTime,
                  appointmentDateTime: formatInTimeZone(
                    zonedTimeToUtc(appointmentDateTime, "UTC"),
                    userInfo.timezoneData[0].abbrevation,
                    "dd-MM-yyyy hh:mm a"
                  ),
                  status,
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
                headerStyle: { background: "#999", color: "#fff" },
                //  filtering: true,
              }}
              actions={[
                (rowData) => ({
                  icon: () => (
                    <span>
                      {rowData.status === "accepted" && (
                        <i class="fa-solid fa-comments" title="chat"></i>
                      )}
                    </span>
                  ),

                  //     // onClick: (e, data) => deleteHandler(data._id),
                  //     // onClick: (e, data) => console.log(data._id)
                }),
                // {docappointments.status === "accepted" && (
                //   {docappointments.acceptedDoctorId !== userInfo.id ?(

                // )}

                // )}

                {
                  icon: () => (
                    <i
                      class="fa-solid fa-eye"
                      onClick={() => history.push("/appointment-details")}
                      title="details"
                    ></i>
                  ),

                  // onClick: () => history.push("/appointment-details"),
                },
                (rowData) => ({
                  icon: () => (
                    <span>
                      {rowData.status === "accepted" && (
                        <i
                          class="fa-solid fa-file-circle-plus"
                          onClick={() =>
                            history.push(`/doctorPrescription/${rowData._id}`)
                          }
                          title="prescription"
                        ></i>
                      )}
                    </span>
                  ),
                  // onClick: () => history.push("/doctorPrescription/{_id}"),
                }),
                // <>
                //   {_id !== userInfo.id
                // ?

                //

                (rowData) => ({
                  icon: (e) => (
                    <span>
                      {rowData.status !== "accepted" && (
                        <i
                          class="fa-solid fa-circle-check"
                          style={{ color: "green" }}
                          onClick={() => handleAccept(rowData["_id"])}
                          title="Approve"
                        ></i>
                      )}
                    </span>
                  ),
                  // tooltip: "Approve",
                  // disabled: rowData,

                  // onClick: () => swal("Accepted"),
                  // onClick: () => {
                  //   handleAccept(rowData["_id"]);
                  //     // onClick: (e, data) => console.log(data._id)
                  // },
                }),
                (rowData) => ({
                  icon: () => (
                    <span>
                      {rowData.status === "accepted" && (
                        <i
                          onClick={() => history.push(`/cancel/${rowData._id}`)}
                          class="fa-solid fa-circle-minus"
                          style={{ color: "#FF0000" }}
                          title="Cancel"
                        ></i>
                      )}
                    </span>
                  ),
                  // tooltip: "Cancel",

                  // onClick: () => swal("Returned"),

                  // onClick: (e, data) => updateHandler(data._id),
                }),
                // </>,
              ]}
            />
          </div>
        </>
      )}
    </Container>
  );
}
export default Appointmentlist;