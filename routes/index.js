const express = require("express");

const auth = require("../controllers/auth");
const patient = require("../controllers/patient");
const doctor = require("../controllers/doctor");
const { wrapAsync } = require("../helpers/error");
let {
  validateJWTToken,
  validateUserEmailIsVerified,
  validateUserIsOfPatientType,
  validateUserIsOfDoctorType,
} = require("../middlewares/auth");

validateJWTToken = wrapAsync(validateJWTToken);
validateUserEmailIsVerified = wrapAsync(validateUserEmailIsVerified);
const router = express.Router();

// Logging
router.use("/", (req, res, next) => {
  const protocol = req.protocol;
  const host = req.hostname;
  const url = req.originalUrl;
  const method = req.method;

  const fullUrl = `${method} - ${protocol}://${host}:${url}`;
  console.log(fullUrl);
  next();
});

// Authentication Routes
router.post("/auth/login", wrapAsync(auth.login));
router.post("/auth/register", wrapAsync(auth.register));
router.get("/auth/logout", validateJWTToken, wrapAsync(auth.logout));

// patient Routes
router.get(
  "/patient/getPatientData",
  validateJWTToken,
  validateUserIsOfPatientType,
  patient.getPatientData
);

router.post(
  "/patient/getPreliminaryResult",
  validateJWTToken,
  validateUserIsOfPatientType,
  patient.getPreliminaryResult
);

router.get(
  "/patient/getAllResults",
  validateJWTToken,
  validateUserIsOfPatientType,
  patient.getAllResults
);

router.post(
  "/patient/updateDoctorPreference",
  validateJWTToken,
  validateUserIsOfPatientType,
  patient.updateDoctorPreference
);

router.post(
  "/patient/getConsultationByDoctor",
  validateJWTToken,
  validateUserIsOfPatientType,
  patient.getConsultationByDoctor
);

router.get("/patient/getReport", validateJWTToken, patient.getReport);

// Doctor Routes
router.get("/doctor/getConnectList", validateJWTToken, doctor.getConnectList);

router.post(
  "/doctor/passFinalVerdict",
  validateJWTToken,
  validateUserIsOfDoctorType,
  doctor.passFinalVerdict
);

router.get("/test", validateJWTToken, (req, res) => {
  res.send("Yo Bitch");
});

module.exports = router;
