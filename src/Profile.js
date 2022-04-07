import "./Profile.css";
import React, { useEffect } from "react";
import Report from "./Report";
import { useStateValue } from "./StateProvider";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button } from "@material-ui/core";
import { db } from "./firebase";
import { onSnapshot, collection, doc, setDoc } from "firebase/firestore";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 - rand();
  const left = 50 - rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

const useModalStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Profile() {
  const modalClasses = useModalStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [{ user }] = useStateValue();
  const [openModal, setOpenModal] = React.useState(false);
  const [age, setAge] = React.useState(0);
  const [blood, setBlood] = React.useState("");
  const [sex, setSex] = React.useState("");
  const [mobile, setMobile] = React.useState(0);
  const [details, setDetails] = React.useState(null);
  const [reports, setReports] = React.useState([]);

  useEffect(() => {
    onSnapshot(doc(db, "users", user?.uid), (doc) => {
      setDetails(doc.data());
    });
    const path = `users/${user?.uid}/reports`;
    onSnapshot(collection(db, path), () => {
      console.log(doc);
    });
    const ref = `users/${user?.uid}/reports`;
    onSnapshot(
      collection(db, ref),
      (snapshot) => {
        snapshot.docs.forEach((doc) => {
          console.log(doc.data());
        });
        setReports(snapshot.docs);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const handleOpenModal = () => {
    console.log("open");

    setOpenModal(true);
  };
  const handleClose = () => {
    console.log("close");
    setOpenModal(false);
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(db);
    setDoc(doc(db, "users", user?.uid), {
      age: age,
      blood: blood,
      sex: sex,
      mobile: mobile,
    });
    console.log("success");
    setAge("");
    setSex("");
    setMobile("");
    setBlood("");
    setOpenModal(false);
  };

  const body = (
    <div style={modalStyle} className={modalClasses.paper}>
      <h2>Update Details</h2>
      <form>
        <div className="row p-2">
          <label className="col-4" for="age">
            Age :
          </label>
          <input
            className="col-6 profile__update"
            name="age"
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          ></input>
        </div>
        <div className="row p-2">
          <label className="col-4" for="blood">
            Blood Group :
          </label>
          <select
            className="col-6 profile__update"
            id="blood"
            name="blood"
            value={blood}
            onChange={(e) => setBlood(e.target.value)}
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="row p-2">
          <label className="col-4" for="sex">
            Gender :
          </label>
          <select
            className="col-6 profile__update"
            id="sex"
            name="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="row p-2">
          <label className="col-4" for="mobile">
            Mobile Number :
          </label>
          <input
            className="col-6 profile__update"
            name="mobile"
            id="mobile"
            value={mobile}
            type="number"
            onChange={(e) => setMobile(e.target.value)}
          ></input>
        </div>

        <Button
          style={{ color: "white", backgroundColor: "#16a596" }}
          className="col-11 mt-4 ml-2"
          onClick={handleUpdate}
          type="submit"
        >
          Update
        </Button>
      </form>
    </div>
  );

  console.log(user);

  return (
    <>
      <div className="profileImage offset-5 col-2">
        <img src={user?.photoURL} style={{ width: "100%" }} alt="/" />
      </div>
      <div className="editIcon">
        <EditIcon
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={handleOpenModal}
        />
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <div className="col-10 offset-1">
        <table className="table table-striped">
          <thead className="row align-items-center">
            <tr>
              <h2>User Details</h2>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>{user?.displayName}</td>
            </tr>
            <tr>
              <th scope="row">Age</th>
              <td>{details === null ? "" : details?.age}</td>
            </tr>
            <tr>
              <th scope="row">Blood Group</th>
              <td>{details === null ? "" : details?.blood}</td>
            </tr>
            <tr>
              <th scope="row">Sex</th>
              <td>{details === null ? "" : details?.sex}</td>
            </tr>
            <tr>
              <th scope="row">Email Id</th>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <th scope="row">Mobile Number</th>
              <td>{details === null ? "" : details?.mobile}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="Reports">
        <h2 className="offset-1">You have {reports.length} reports</h2>
        {reports?.map((doc) => (
          <Report file={doc.data().file} name={doc.data().name} />
        ))}
      </div>
    </>
  );
}

export default Profile;
