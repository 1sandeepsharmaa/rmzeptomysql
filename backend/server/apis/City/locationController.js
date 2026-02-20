const axios = require("axios");

/* ===== GET STATES ===== */
const getStatesOfIndia = async (req, res) => {
  try {
    const apiRes = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      { country: "India" }
    );

    return res.status(200).json({
      success: true,
      data: apiRes.data.data.states, // array of states
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch states",
    });
  }
};

/* ===== GET CITIES BY STATE ===== */
const getCitiesByState = async (req, res) => {
  try {
    const { stateName } = req.body;

    if (!stateName) {
      return res.status(400).json({
        success: false,
        message: "State name required",
      });
    }

    const apiRes = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: "India",
        state: stateName,
      }
    );

    return res.status(200).json({
      success: true,
      data: apiRes.data.data, // array of cities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};

module.exports = {getStatesOfIndia,getCitiesByState,};
