import { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { SERVER_BASE_URL } from "../../config/config";
import "./sidebar.scss";
import { UserContext } from "../../context/user_context";

const logoutHandler = () => {
  axios
    .get(`${SERVER_BASE_URL}/api/auth/logout`)
    .then((res) => {
      window.location = "/";
    })
    .catch((err) => {
      window.location = "/";
    });
};

const sidebarNavItems = [
  {
    display: "Dashboard",
    icon: <i className="bx bx-home"></i>,
    to: "/",
    section: "",
  },
];

const patientSidebarItems = [
  {
    display: "Diagnose",
    icon: <i class="bx bx-log-in"></i>,
    to: "/diagnose",
    section: "diagnose",
  },
  {
    display: "Results",
    icon: <i class="bx bx-log-in"></i>,
    to: "/results",
    section: "results",
  },
  {
    display: "Appointments",
    icon: <i class="bx bx-log-in"></i>,
    to: "/appointments",
    section: "appointments",
  },
];

const doctorSidebarItems = [
  {
    display: "Diagnose",
    icon: <i class="bx bx-log-in"></i>,
    to: "/diagnose",
    section: "diagnose",
  },
  {
    display: "Consultation",
    icon: <i class="bx bx-log-in"></i>,
    to: "/consultation",
    section: "consultation",
  },
];

const getUpdatedSidebarItems = (value) => {
  let finalSidebarItems = [
    ...sidebarNavItems,
    {
      display: "SignIn",
      icon: <i class="bx bx-log-in"></i>,
      to: "/signin",
      section: "signin",
      requireLoggedOut: true,
    },
  ];

  if (value.loggedIn) {
    if (value.user.userType === "patient")
      finalSidebarItems = [...sidebarNavItems, ...patientSidebarItems];
    else finalSidebarItems = [...sidebarNavItems, ...doctorSidebarItems];
  }
  return finalSidebarItems;
};

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();
  const value = useContext(UserContext);
  let finalSidebarItems = getUpdatedSidebarItems(value);

  console.log(value);

  useEffect(() => {
    finalSidebarItems = getUpdatedSidebarItems(value);
  }, [value]);

  useEffect(
    () => {
      setTimeout(() => {
        const sidebarItem = sidebarRef.current.querySelector(
          ".sidebar__menu__item"
        );
        indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
        setStepHeight(sidebarItem.clientHeight);
      }, 50);
    },
    [],
    [value]
  );

  // change active index
  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = finalSidebarItems.findIndex(
      (item) => item.section === curPath
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <UserContext.Consumer>
      {({ user, loggedIn, updateUser, updateLogInStatus }) => (
        <div className="sidebar">
          <center>
            <div className="sidebar__logo">SmHe❤rt</div>
          </center>
          <div ref={sidebarRef} className="sidebar__menu">
            <div
              ref={indicatorRef}
              className="sidebar__menu__indicator"
              style={{
                display: activeIndex < 0 ? "none" : "block",
                transform: `translateX(-50%) translateY(${
                  activeIndex * stepHeight
                }px)`,
              }}
            ></div>

            {finalSidebarItems.map((item, index) => {
              if (!item.requireLoggedOut || !loggedIn) {
                return (
                  <Link to={item.to} key={index}>
                    <div
                      className={`sidebar__menu__item ${
                        activeIndex === index ? "active" : ""
                      }`}
                    >
                      <div className="sidebar__menu__item__icon">
                        {item.icon}
                      </div>
                      <div className="sidebar__menu__item__text">
                        {item.display}
                      </div>
                    </div>
                  </Link>
                );
              }
            })}

            {loggedIn ? (
              <>
                {/* {user.userType === "patient" ? ():()} */}

                <div
                  onClick={logoutHandler}
                  style={{ cursor: "pointer" }}
                  className={`sidebar__menu__item`}
                >
                  <div className="sidebar__menu__item__icon">
                    <i class="bx bx-log-out"></i>
                  </div>
                  <div className="sidebar__menu__item__text">Logout</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </UserContext.Consumer>
  );
};

export default Sidebar;
