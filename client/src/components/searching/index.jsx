import React, { useContext } from "react";
import styles from "./Searching.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RiUserSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { decodeName } from "../../utils/functions/NameManipulator";
import { SocketContext } from "../../context/SocketContext";
import { useSearchingSocketEvents } from "../../utils/functions/SocketEvents";
import {
  handleSearch,
  handleStopSearching,
} from "../../utils/functions/SearchUtils";

const Searching = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const socket = useContext(SocketContext);
  const { name, isSearching } = useSelector((state) => state.userState);

  useSearchingSocketEvents(socket, dispatch, name, navigation);

  return (
    <div className={styles.main}>
      <p className={styles.usersName}>Hii {decodeName(name)} !! </p>
      {isSearching ? (
        <>
          <Loader isInbutton={true} />
          <button
            onClick={() => handleStopSearching(dispatch, socket)}
            className={styles.searchingPage}
          >
            stop Searching
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handleSearch(dispatch, socket, name)}
            className={styles.searchingPage}
          >
            Start Searching <RiUserSearchLine />
          </button>
        </>
      )}
    </div>
  );
};

export default Searching;
