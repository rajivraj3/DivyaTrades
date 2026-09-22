import React, { useEffect, useState } from "react";
import axios from "axios";

function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSupportTopics = async () => {
      if (!apiUrl) {
        setResults([]);
        setFeatured([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/support/search`, {
          params: { q: searchTerm },
        });

        setResults(response.data.results || []);
        setFeatured(response.data.featured || []);
      } catch (error) {
        console.error("Support search failed:", error);
        setResults([]);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSupportTopics, 250);
    return () => clearTimeout(timer);
  }, [apiUrl, searchTerm]);

  return (
    <section className="container-fluid" id="supportHero">
      <div className="support-wrapper" id="supportWrapper">
        <h1 className="support-title">Support Portal</h1>
        <a href="#" className="track-tickets">
          Track Tickets
        </a>
      </div>

      <div className="row support-inner">
        <div className="col-lg-7 col-md-12 support-search-panel">
          <h2 className="support-search-title">
            Search for an answer or browse help topics to create a ticket
          </h2>

          <div className="support-search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Eg. how do I activate F&O"
              aria-label="Search support topics"
            />
          </div>

          <div className="support-links">
            {loading ? (
              <span>Loading...</span>
            ) : results.length > 0 ? (
              results.map((item) => (
                <a key={item.title} href="#">
                  {item.title}
                </a>
              ))
            ) : (
              <span>No matching results found.</span>
            )}
          </div>
        </div>

        <div className="col-lg-5 col-md-12 support-featured-panel">
          <h3 className="support-featured-title">Featured</h3>

          <ol className="support-featured-list">
            {featured.map((item) => (
              <li key={item.title}>
                <a href="#">{item.title}</a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
