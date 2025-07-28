import { useLocation } from "react-router-dom";
import "./TourMap.css";

function TourMap() {
  const location = useLocation();
  const { suggestion, formData, generatedAt } = location.state || {};

  // Function to format the suggestion text with proper styling
  const formatSuggestionText = (text) => {
    if (!text) return null;

    const processFormattedText = (content) => {
      if (!content) return content;

      // Process links
      let processed = content.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      );

      // Process bold text (remove asterisks)
      processed = processed.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");

      return processed;
    };

    const createSafeHtml = (html) => {
      return { __html: html };
    };

    return text.split("\n\n").map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;

      if (paragraph.startsWith("#")) {
        const level = paragraph.match(/#+/g)[0].length;
        const headingText = paragraph.replace(/#+/g, "").trim();
        const HeadingTag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
        return (
          <HeadingTag
            key={`h${level}-${pIndex}`}
            className={`suggestion-heading ${
              level === 1
                ? "mt-4 mb-3"
                : level === 2
                ? "mt-3 mb-2"
                : "mt-2 mb-2"
            }`}
            dangerouslySetInnerHTML={createSafeHtml(
              processFormattedText(headingText)
            )}
          />
        );
      } else if (paragraph.match(/^\d+\./)) {
        return (
          <ol key={`ol-${pIndex}`} className="suggestion-list numbered-list">
            {paragraph.split("\n").map((item, iIndex) => {
              const cleanedItem = item.replace(/^\d+\.\s*/, "").trim();
              return (
                <li
                  key={`li-${iIndex}`}
                  className="suggestion-list-item"
                  dangerouslySetInnerHTML={createSafeHtml(
                    processFormattedText(cleanedItem)
                  )}
                />
              );
            })}
          </ol>
        );
      } else if (paragraph.startsWith("-") || paragraph.startsWith("*")) {
        return (
          <ul key={`ul-${pIndex}`} className="suggestion-list bullet-list">
            {paragraph.split("\n").map((item, iIndex) => {
              const cleanedItem = item.replace(/^[-*]\s*/, "").trim();
              return (
                <li
                  key={`li-${iIndex}`}
                  className="suggestion-list-item"
                  dangerouslySetInnerHTML={createSafeHtml(
                    processFormattedText(cleanedItem)
                  )}
                />
              );
            })}
          </ul>
        );
      } else {
        return (
          <div
            key={`para-${pIndex}`}
            className="suggestion-paragraph"
            dangerouslySetInnerHTML={createSafeHtml(
              processFormattedText(paragraph)
            )}
          />
        );
      }
    });
  };

  return (
    <div className="tour-map-container">
      <div className="container py-5">
        {suggestion ? (
          <>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold">
                Your {formData?.travelType} Trip to {formData?.destination}
              </h1>
              <p className="lead">
                {formData?.startDate && formData?.endDate && (
                  <span>
                    {new Date(formData.startDate).toLocaleDateString()} -{" "}
                    {new Date(formData.endDate).toLocaleDateString()} •{" "}
                  </span>
                )}
                {formData?.people}{" "}
                {formData?.people === "1" ? "Person" : "People"} •{" "}
                {formData?.travelMode}
              </p>
              {generatedAt && (
                <p className="text-muted small">Generated on: {generatedAt}</p>
              )}
            </div>

            <div className="card shadow-lg mb-5">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0">Your Personalized Travel Plan</h2>
              </div>
              <div className="card-body">
                <div className="travel-plan">
                  {formatSuggestionText(suggestion)}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => window.print()}
              >
                Print Your Travel Plan
              </button>
            </div>
          </>
        ) : (
          <div className="alert alert-danger">
            <h4>No suggestions available</h4>
            <p>
              Please go back and fill out the travel plan form to generate
              suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TourMap;
