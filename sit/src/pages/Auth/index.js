import classNames from "classnames/bind";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "~/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "./authSlice";
import images from "~/assets/images";
import Button from "~/components/Button";
import routesConfig from "~/config/router";
import style from "./Auth.module.scss";
import * as userServices from "~/services/authServices";

const cx = classNames.bind(style);

function Auth() {
  const router = () => {
    const href = window.location.href.includes("/register");
    if (href) {
      return false;
    }
    return true;
  };

  const [registered, setRegistered] = useState(router);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const userData = {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelSignWithGoogle = async () => {
    signInWithPopup(auth, provider).then((res) => {
      return (
        setAvatar(res.user.photoURL),
        setPhone(res.user.phoneNumber),
        setEmail(res.user.email)
      );
    });
  };

  const validateEmail = () => {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (email.trim() !== "") {
      if (reg.test(email) === false) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  };

  const validateUsername = () => {
    if (username.trim() !== "") {
      if (username.trim().length <= 8) {
        setUsernameError(true);
        setError(registered ? "" : "Username ph???i t??? 8 k?? t??? tr??? l??n");
        setDisableButton(true);
      } else {
        setDisableButton(false);
        setError("");
        setUsernameError(false);
      }
    }
  };

  const validatePassword = () => {
    if (password.trim() === "") {
      setError("");
      setPasswordError(false);
      setDisableButton(false);
    } else if (password.trim().length <= 8) {
      setDisableButton(true);
      setPasswordError(true);
      setError(registered ? "" : "Vui l??ng nh???p password tr??n 8 k?? t???");
    } else {
      setDisableButton(false);
      setRepasswordError(false);
      setError("");
    }
  };

  const validateRepassword = () => {
    if (password !== repassword) {
      setDisableButton(true);
      setRepasswordError(true);
      setError("Nh???p l???i password kh??ng ch??nh x??c");
    } else if (repassword.trim() === "") {
      setDisableButton(false);
      setRepasswordError(false);
      setError("");
    }
  };

  const handelRegister = () => {
    userData.email = email;
    userData.username = username;
    userData.password = password;
    userData.avatar = avatar;
    userData.phone = phone;

    if (password.trim() === "" || username.trim() === "") {
      setDisableButton(true);
      setError("Vui l??ng nh???p ?????y ????? th??ng tin");
    } else {
      const createAccount = async () => {
        const result = await userServices.register(userData);
        if (result.status === false) {
          setError(result.message);
          setDisableButton(true);
        } else {
          localStorage.setItem("itsSession", JSON.stringify(result.data));
          dispatch(login(result.data));
          navigate(routesConfig.home);
        }
      };

      createAccount();
    }
  };

  const handelLogin = () => {
    const userData = {
      username: username,
      password: password,
    };

    const userLogin = async () => {
      const result = await userServices.login(userData);
      if (result.status) {
        localStorage.setItem("itsSession", JSON.stringify(result.data));
        dispatch(login(result.data));
        navigate(routesConfig.home);
      } else {
        setError(result.message);
        setDisableButton(true);
      }
    };

    userLogin();
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("options")}>
          {registered ? (
            <div>
              <Button
                column
                leftIcon={<img src={images.google} alt="Google" width={25} />}
              >
                ????ng nh???p v???i Google
              </Button>
            </div>
          ) : (
            <div>
              <Button
                onClick={handelSignWithGoogle}
                column
                leftIcon={<img src={images.google} alt="Google" width={25} />}
              >
                ????ng k?? v???i Google
              </Button>
            </div>
          )}
        </div>
        <div className={cx("main")}>
          {registered ? (
            <></>
          ) : (
            <div className={cx("input")}>
              <label htmlFor="email">
                <span>Email:</span>
                <input
                  className={cx({
                    error: emailError,
                  })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail()}
                  onFocus={() => {
                    setEmailError(false);
                    setDisableButton(false);
                    setError("");
                  }}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Vui l??ng nh???p Email"
                />
              </label>
            </div>
          )}
          <div className={cx("input")}>
            <label htmlFor="username">
              <span>Username:</span>
              <input
                className={cx({
                  error: usernameError,
                })}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => validateUsername()}
                onFocus={() => {
                  setDisableButton(false);
                  setError("");
                  setUsernameError(false);
                }}
                type="text"
                name="username"
                id="username"
                placeholder={"Vui l??ng nh???p username"}
              />
            </label>
          </div>
          <div className={cx("input")}>
            <label htmlFor="password">
              <span>Password:</span>
              <input
                className={cx({
                  error: passwordError,
                })}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => {
                  setDisableButton(false);
                  setError("");
                  setPasswordError(false);
                }}
                onBlur={() => validatePassword()}
                type="password"
                name="password"
                id="password"
                placeholder="Vui l??ng nh???p password"
              />
            </label>
          </div>
          {registered ? (
            <></>
          ) : (
            <div className={cx("input")}>
              <label htmlFor="repassword">
                <span>Nh???p l???i password:</span>
                <input
                  className={cx({
                    error: repasswordError,
                  })}
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  onBlur={() => validateRepassword()}
                  onFocus={() => {
                    setRepasswordError(false);
                    setDisableButton(false);
                    setError("");
                  }}
                  type="password"
                  name="repassword"
                  id="repassword"
                  placeholder="Vui l??ng nh???p l???i password"
                />
              </label>
            </div>
          )}
          <div className={cx("btn")}>
            {registered ? (
              <Button primary fwidth onClick={handelLogin}>
                ????ng nh???p
              </Button>
            ) : disableButton ? (
              <Button primary fwidth disable>
                ????ng k??
              </Button>
            ) : (
              <Button primary fwidth onClick={handelRegister}>
                ????ng k??
              </Button>
            )}
          </div>

          <p className={cx("bottom-text")}>
            {registered ? "Ch??a c?? t??i kho???n?" : "???? c?? t??i kho???n?"}{" "}
            <span
              onClick={() => {
                setRegistered(!registered);
                setError("");
                setRepassword("");
                setDisableButton(false);
              }}
            >
              {registered ? "????ng k??" : "????ng nh???p"}
            </span>
          </p>
        </div>
      </div>
      <p className={cx("error-log")}>{error}</p>
    </div>
  );
}

export default Auth;
