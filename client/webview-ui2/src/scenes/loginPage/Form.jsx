import { useState, useEffect } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../state";

import FlexBetween from "../../components/FlexBetween";
import { vscode } from "../../utilities/vscode";

// import { apiUrl } from "../../../../src/constants";

const registerSchema = yup.object().shape({
  username: yup.string().required("required"),
  EID: yup.string().required("required"),
  password: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  EID: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  username: "",
  EID: "",
  password: "",
};

const initialValuesLogin = {
  EID: "",
  password: "",
};

function Form() {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const apiUrl = useSelector((state) => state.apiUrl);

  const register = async (values, setSubmitting) => {
    const savedUserResponse = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!savedUserResponse.ok) {
      vscode.postMessage({
        command: "error",
        text: "User EID already exists",
      });
      return;
    } else {
      const savedUser = await savedUserResponse.json();
      setSubmitting.resetForm();

      if (savedUser) {
        setPageType("login");
      }
    }
  };

  const login = async (values, setSubmitting) => {
    const loggedInResponse = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!loggedInResponse.ok) {
      vscode.postMessage({
        command: "error",
        text: "Invalid EID or password",
      });
      return;
    }
    const loggedIn = await loggedInResponse.json();
    // console.log(loggedIn);

    setSubmitting.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          // set state (Redux)
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, setSubmitting) => {
    if (isLogin) {
      await login(values, setSubmitting);
    }
    if (isRegister) {
      await register(values, setSubmitting);
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              // div as child will be span 4 if mobile
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}>
            {isRegister && (
              <>
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
            {/* <TextField
              label="EID"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.EID}
              name="EID"
              error={Boolean(touched.EID) && Boolean(errors.EID)}
              helperText={touched.EID && errors.EID}
              sx={{ gridColumn: "span 4" }}
            /> */}
            <TextField
              label="EID"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.EID}
              name="EID"
              error={Boolean(touched.EID) && Boolean(errors.EID)}
              helperText={touched.EID && errors.EID}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* Buttons */}
          <Button
            fullWidth
            type="submit"
            sx={{
              "m": "2rem 0",
              "p": "1rem",
              "backgroundColor": palette.primary.main,
              "color": palette.background.alt,
              "&:hover": { color: palette.primary.main },
            }}>
            {isLogin ? "Login" : "Register"}
          </Button>
          <Typography
            onClick={() => {
              setPageType(isLogin ? "register" : "login");
              resetForm();
            }}
            sx={{
              "textDecoration": "underline",
              "color": palette.primary.main,
              "&:hover": {
                cursor: "pointer",
                color: palette.primary.light,
              },
            }}>
            {isLogin
              ? "New to RPS Interface? Sign Up here."
              : "Already have an account? Sign in here."}
          </Typography>
        </form>
      )}
    </Formik>
  );
}

export default Form;
