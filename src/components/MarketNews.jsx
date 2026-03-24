import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronRight, TrendingDown, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react';

// Fallback in case API fails
const STATIC_NEWS = [
  { id: 1, title: "US Dollar Index hits 6-month high amid inflation fears", type: "up", link: "#" },
  { id: 2, title: "European Central Bank keeps interest rates unchanged", type: "neutral", link: "#" },
  { id: 3, title: "Bank of England hints at rate cuts in Q3", type: "down", link: "#" },
  { id: 4, title: "Japanese Yen continues to slide despite intervention threats", type: "down", link: "#" },
  { id: 5, title: "RBI tightens remittance rules for outward investments", type: "alert", link: "#" },
];

const MarketNews = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    
    // Fetch live financial news
    const fetchLiveNews = async () => {
      try {
        const rssUrl = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664'; // CNBC Finance
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          // Clean up HTML from descriptions
          const cleanItems = data.items.map(item => ({
             ...item,
             cleanDesc: item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
          }));
          setArticles(cleanItems);
        }
      } catch (error) {
        console.error("News fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveNews();
  }, []);

  // Determine what to display
  const mainStory = articles.length > 0 ? articles[0] : null;
  const secondaryStories = articles.length > 2 ? [articles[1], articles[2]] : [];
  
  // Mix API headlines + static tags for the ticker
  const tickerItems = articles.length > 0 
    ? articles.slice(0, 15).map((a, i) => ({ 
        id: `api_${i}`, 
        text: a.title, 
        link: a.link,
        type: i % 3 === 0 ? 'up' : i % 2 === 0 ? 'down' : 'neutral' 
      }))
    : STATIC_NEWS;

  return (
    <div className="w-full flex flex-col overflow-hidden bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-900 mt-8 sm:mt-16 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      
      {/* Featured News Block */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Newspaper className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Market Intelligence</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Live Stories • {currentDate}</p>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-blue-600 dark:hover:text-white uppercase tracking-widest transition-colors cursor-pointer">
            Source: CNBC <ExternalLink size={10} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[250px] bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] animate-pulse">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Live Markets...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Story */}
            {mainStory && (
              <a href={mainStory.link} target="_blank" rel="noopener noreferrer" className="md:col-span-2 group relative rounded-[2rem] overflow-hidden min-h-[250px] flex items-end shadow-md block">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${mainStory.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop'})` }}
                ></div>
                <div className="relative z-20 p-6 sm:p-8 w-full">
                  <span className="px-2 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md mb-3 inline-flex items-center gap-1 shadow-lg shadow-red-500/30">
                    Live Headliner <ExternalLink size={10} />
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 group-hover:text-blue-300 transition-colors">
                    {mainStory.title}
                  </h4>
                  <p className="text-xs text-gray-300 font-medium line-clamp-2 max-w-lg">
                    {mainStory.cleanDesc}
                  </p>
                </div>
              </a>
            )}

            {/* Secondary Stories */}
            <div className="flex flex-col gap-4">
              {secondaryStories.map((story, i) => (
                <a key={i} href={story.link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors group flex flex-col justify-between block">
                  <div>
                    <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      Financial Update <ExternalLink size={8} />
                    </span>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                      {story.title}
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-4 line-clamp-1">
                    {new Date(story.pubDate.replace(/-/g, '/')).toLocaleString()}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scrolling Ticker Tape */}
      <div className="w-full bg-blue-600 dark:bg-blue-900 border-t border-blue-500 dark:border-blue-800 overflow-hidden relative py-2.5">
        <div className="absolute left-0 top-0 bottom-0 z-10 w-8 sm:w-16 bg-gradient-to-r from-blue-600 dark:from-blue-900 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-8 sm:w-16 bg-gradient-to-l from-blue-600 dark:from-blue-900 to-transparent pointer-events-none" />
        
        <div className="flex animate-ticker whitespace-nowrap hover:[animation-play-state:paused] transition-all">
          {[...tickerItems, ...tickerItems].map((news, idx) => (
            <a 
              key={`${news.id}-${idx}`} 
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 border-r border-blue-500/30 flex-shrink-0 hover:bg-blue-500/20 transition-colors py-1 cursor-pointer"
            >
              {news.type === 'up' && <TrendingUp size={14} className="text-white" />}
              {news.type === 'down' && <TrendingDown size={14} className="text-red-200" />}
              {news.type === 'alert' && <AlertCircle size={14} className="text-yellow-200" />}
              {news.type === 'neutral' && <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />}
              <span className="text-[11px] font-bold text-white tracking-wide uppercase hover:underline underline-offset-4">{news.text}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketNews;
