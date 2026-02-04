const Message = ({ sender, text, score }) => {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 border rounded-bl-none"
        }`}
      >
        {/* Message Text */}
        <p>{text}</p>

        {/* Optional Score */}
        {score !== undefined && !isUser && (
          <p className="mt-2 text-xs text-gray-500">
            ATS Readiness Score:{" "}
            <span className="font-semibold">
              {score}%
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Message;
