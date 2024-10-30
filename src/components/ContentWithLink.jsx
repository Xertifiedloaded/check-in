const ContentWithLinks = ({ localPost }) => {

    const parseContent = (content) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = content.split(urlRegex);
      const urls = content.match(urlRegex) || [];
      
      const result = [];
      parts.forEach((part, index) => {
        result.push(part);
        if (urls[index]) {
          result.push(urls[index]);
        }
      });
      
      return result;
    };
  
    return (
      <p className="text-gray-800 leading-relaxed">
        {parseContent(localPost.content).map((part, index) => {
          if (part.match(/^https?:\/\//)) {
            return (
              <a
                key={index}
                href={part}
                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {part}
              </a>
            );
          }
          return <span className="text-gray-800 leading-relaxed" key={index}>{part}</span>;
        })}
      </p>
    );
  };
  
  export default ContentWithLinks;