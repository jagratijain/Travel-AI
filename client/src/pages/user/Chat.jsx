import "../styles/Chat.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Chat = ({ onClose, data }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [conversationId] = useState(() => Date.now().toString());
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (!initialMessageSent.current) {
      initialMessageSent.current = true;
      setShowTypingIndicator(true);

      const initialMessageTimeout = setTimeout(() => {
        setMessages([
          { type: "received", text: "Hello, how can I assist you?" },
        ]);
        setShowTypingIndicator(false);
      }, 2000);

      return () => clearTimeout(initialMessageTimeout);
    }
  }, []);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "sent", text: inputMessage },
    ]);

    setShowTypingIndicator(true);

    generateAnswer(inputMessage);
    setInputMessage("");
  };

  // AI Chatbot for packages
  async function generateAnswer(message) {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

      // Prepare conversation history (exclude typing indicators and format properly)
      const conversationHistory = messages
        .filter((msg) => !msg.isTyping)
        .map((msg) => ({
          type: msg.type,
          text:
            typeof msg.text === "string"
              ? msg.text
              : msg.text.map((p) => p.props.children).join(" "),
        }));

      const response = await axios.post(
        `${API_BASE_URL}/api/ai-insights/chat`,
        {
          message: message,
          packageDestination: data.packageDestination,
          conversationHistory: conversationHistory,
          conversationId: conversationId,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const formattedResponse = formatResponse(response.data.response);

        setMessages((prevMessages) => [
          ...prevMessages.filter(
            (msg) => !(msg.type === "received" && msg.isTyping)
          ),
          { type: "received", text: formattedResponse },
        ]);
      } else {
        throw new Error(response.data.error || "Failed to generate response");
      }
    } catch (error) {
      console.error("Error generating chat response:", error);

      const errorMessage =
        error.response?.data?.error ||
        "Sorry, I couldn't process your message. Please try again.";

      setMessages((prevMessages) => [
        ...prevMessages.filter(
          (msg) => !(msg.type === "received" && msg.isTyping)
        ),
        { type: "received", text: errorMessage },
      ]);
    } finally {
      setShowTypingIndicator(false);
    }
  }

  const formatResponse = (text) => {
    // Process the response to handle formatting
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }}></p>
      );
    });
  };

  return (
    <div className="chat-container fixed md:bottom-4 md:right-4 md:w-96 w-full h-full md:h-auto md:max-h-[600px] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col border border-black">
      <div className="chat-header bg-green-700 text-white flex justify-between items-center p-2 rounded-t-lg">
        <h3 className="font-semibold">Chat</h3>
        <button onClick={onClose} className="chat-close-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="chat-body flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "sent" ? "justify-end" : ""
            } mb-4`}
          >
            <div
              className={`max-w-[75%] ${
                message.type === "sent"
                  ? "bg-green-700 text-white"
                  : "bg-gray-200"
              } p-3 rounded-lg`}
            >
              {message.type === "received" && message.text instanceof Array
                ? message.text.map((line, idx) => (
                    <React.Fragment key={idx}>{line}</React.Fragment>
                  ))
                : message.text}
            </div>
          </div>
        ))}
        {showTypingIndicator && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[75%] bg-gray-200 p-3 rounded-lg typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-100">
        <textarea
          placeholder="Type your message..."
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          className="bg-green-700 text-white px-6 py-2 mt-2 rounded-lg w-full md:w-auto"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
