import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Fab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { TbMessageChatbot } from "react-icons/tb";
import axios from "axios";
import { useState, useEffect } from "react";

function RecommendationModal({ open, onClose, recommendation, loading }) {
  const formatText = (text) => {
    return text.split("\n").map((line, index) => {
      line = line.trim();
      if (line.startsWith("*")) {
        // Handle bullet points
        const bulletContent = line.substring(1).trim();
        return <li key={index}>{formatInlineStyles(bulletContent)}</li>;
      } else {
        // Handle regular text
        return <p key={index}>{formatInlineStyles(line)}</p>;
      }
    });
  };

  const formatInlineStyles = (text) => {
    let parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Bold text
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      } else {
        // Regular text, remove any remaining single asterisks
        return part.replace(/\*/g, "");
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="relative">
              <div className="w-24 h-24 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
              <div className="w-24 h-24 border-r-4 border-l-4 border-pink-500 rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700 animate-pulse">
              Crafting your perfect adventure...
            </p>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : (
          <DialogContentText component="div">
            <DialogTitle>Your Travel Recommendations</DialogTitle>
            <ul style={{ paddingLeft: "20px", listStyleType: "none" }}>
              {formatText(recommendation)}
            </ul>
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ScrollDialog() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [formData, setFormData] = useState({
    month: "",
    travelers: "",
    budget: "",
    activities: [],
    // preferences: ''
  });
  const [packageDestinations, setPackageDestinations] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [openRecommendation, setOpenRecommendation] = useState(false);
  const [loading, setLoading] = useState(false);

  const months = [
    { value: "jan", label: "January" },
    { value: "feb", label: "February" },
    { value: "mar", label: "March" },
    { value: "apr", label: "April" },
    { value: "may", label: "May" },
    { value: "jun", label: "June" },
    { value: "jul", label: "July" },
    { value: "aug", label: "August" },
    { value: "sep", label: "September" },
    { value: "oct", label: "October" },
    { value: "nov", label: "November" },
    { value: "dec", label: "December" },
  ];

  const isFormValid = () => {
    return (
      formData.month &&
      formData.travelers > 0 &&
      formData.budget &&
      formData.activities.length > 0
    );
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      month: "",
      travelers: "",
      budget: "",
      activities: [],
      // preferences: ''
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "travelers" && value < 1) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      activities: checked
        ? [...prevData.activities, name]
        : prevData.activities.filter((activity) => activity !== name),
    }));
  };

  const handleGetRecommendations = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields.");
      return;
    }

    const templateString = `We are a group of ${
      formData.travelers
    } traveling in ${
      formData.month
    }. We are interested in ${formData.activities.join(", ")}, with a ${
      formData.budget
    } budget. Please suggest the top 3 destinations for us.`;

    handleClose(); // Close the input modal
    setLoading(true);
    setOpenRecommendation(true); // Open the recommendation modal immediately

    const response = await generateAnswer(templateString);
    setAiResponse(response);
    setLoading(false);
  };

  async function generateAnswer(message) {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

      const response = await axios.post(
        `${API_BASE_URL}/api/ai-insights/generate`,
        {
          message: message,
          packageDestinations: packageDestinations,
        }
      );

      if (response.data.success) {
        return response.data.recommendation;
      } else {
        throw new Error(
          response.data.error || "Failed to generate recommendations"
        );
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);

      if (error.response?.data?.error) {
        return `Sorry, ${error.response.data.error}`;
      } else if (error.message) {
        return `Sorry, ${error.message}`;
      } else {
        return "Sorry, I couldn't generate recommendations at this time. Please try again later.";
      }
    }
  }

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${API_BASE_URL}/api/package/get-packages`);
        const data = await res.json();

        const destinations = data.packages.map((pkg) => pkg.packageDestination);
        const destinationsString = destinations.join(", ");
        setPackageDestinations(destinationsString);
        // console.log(destinationsString);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPackages();
  }, []);

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Fab
        onClick={handleClickOpen("paper")}
        color="primary"
        aria-label="edit"
        className="fixed bottom-4 right-4 z-50"
      >
        <TbMessageChatbot size={24} />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">AI Place Recommender</DialogTitle>
        <DialogContent dividers={scroll === "paper"} className="p-4">
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className="mb-4"
          >
            Please answer the following questions to help us recommend the
            perfect travel destination for you:
          </DialogContentText>

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel shrink htmlFor="month-select">
              Month of Travel
            </InputLabel>
            <Select
              id="month-select"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              label="Month of Travel"
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Number of Travelers"
            type="number"
            name="travelers"
            value={formData.travelers}
            onChange={handleInputChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel shrink htmlFor="budget-select">
              Budget Range
            </InputLabel>
            <Select
              id="budget-select"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              label="Budget Range"
            >
              <MenuItem value="budget">Budget</MenuItem>
              <MenuItem value="midrange">Mid-range</MenuItem>
              <MenuItem value="luxury">Luxury</MenuItem>
            </Select>
          </FormControl>

          <FormGroup className="mt-4">
            <DialogContentText className="mb-2">
              Preferred Activities:
            </DialogContentText>
            {[
              "Beach",
              "Hiking",
              "Cultural Sites",
              "Food Tours",
              "Adventure Sports",
            ].map((activity) => (
              <FormControlLabel
                key={activity}
                control={
                  <Checkbox
                    checked={formData.activities.includes(activity)}
                    onChange={handleCheckboxChange}
                    name={activity}
                  />
                }
                label={activity}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleGetRecommendations} disabled={!isFormValid()}>
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      <RecommendationModal
        open={openRecommendation}
        onClose={() => {
          setOpenRecommendation(false);
          setAiResponse("");
        }}
        recommendation={aiResponse}
        loading={loading}
      />
    </React.Fragment>
  );
}
