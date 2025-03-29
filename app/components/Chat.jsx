"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiMicOff, FiSend, FiX } from "react-icons/fi";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let recognition = null;

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    return () => {
      if (recognition) recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const token = getToken();
    if (!token) {
      alert("Please login first");
      return;
    }

    const userMessage = { text: message, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }

      const data = await response.json();
      const botMessage = { text: data.reply, sender: "bot" };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      const errorMessage = "Sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { text: errorMessage, sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-[calc(100vw-2rem)] sm:w-80 max-w-md bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
          >
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-purple-700 flex justify-between items-center">
              <h3 className="font-semibold text-white text-sm sm:text-base">AI Assistant</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <FiX size={18} className="sm:size-5" />
              </button>
            </div>
            
            <div className="h-48 sm:h-64 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] sm:max-w-xs p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                    msg.sender === "user" 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white p-2 sm:p-3 rounded-lg rounded-bl-none max-w-[80%] sm:max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2 sm:p-3 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`p-1.5 sm:p-2 rounded-full ${
                    isListening 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {isListening ? (
                    <FiMicOff size={16} className="sm:size-[18px]" />
                  ) : (
                    <FiMic size={16} className="sm:size-[18px]" />
                  )}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                  placeholder={isListening ? "Listening..." : "Type your message..."}
                  className="flex-1 p-1.5 sm:p-2 bg-gray-700 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim()}
                  className="p-1.5 sm:p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
                >
                  <FiSend size={16} className="sm:size-[18px]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full shadow-lg"
        >
          <FiMic size={20} className="sm:size-6" />
        </motion.button>
      )}
    </div>
  );
}