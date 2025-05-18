import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import "./MusicPlayer.css";

const MusicPlayer = () => {
  const [url, setUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [title, setTitle] = useState("");
  const [seeking, setSeeking] = useState(false);
  const [queue, setQueue] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [playerKey, setPlayerKey] = useState(0);

  const playerRef = useRef(null);

  const handleChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsPlaying(false);
    setTitle("");
    setPlayed(0);
    setDuration(0);
    fetchTitle(newUrl);
  };

  const fetchTitle = (youtubeUrl) => {
    const videoId = extractYouTubeVideoID(youtubeUrl);
    if (videoId) {
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        .then((res) => res.json())
        .then((data) => setTitle(data.title))
        .catch(() => setTitle("Unknown Title"));
    }
  };

  const extractYouTubeVideoID = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    return match ? match[1] : null;
  };

  const togglePlay = () => {
    if (url) setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSeekChange = (e) => setPlayed(parseFloat(e.target.value));
  const handleSeekMouseDown = () => setSeeking(true);
  const handleSeekMouseUp = (e) => {
    const newTime = parseFloat(e.target.value);
    setSeeking(false);
    if (playerRef.current) playerRef.current.seekTo(newTime);
  };

  const handleAddToQueue = () => {
    if (nextUrl && queue.length < 10) {
      setQueue([...queue, nextUrl]);
      setNextUrl("");
    }
  };

  const handleEnded = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setUrl(next);
      setQueue(queue.slice(1));
      fetchTitle(next);
      setPlayed(0);
      setDuration(0);
      setIsPlaying(true);
      setPlayerKey((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="music-player-container">
      <h2>YouTube Audio Player</h2>

      <input
        type="text"
        placeholder="Paste YouTube URL to play"
        value={url}
        onChange={handleChange}
        className="music-player-input"
      />
      {title && <h4 style={{ color: "#bbb" }}>{title}</h4>}

      <button
        onClick={togglePlay}
        className="music-player-button"
        disabled={!url}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <div className="music-player-progress">
        <span>{formatTime(played)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={played}
          step="0.1"
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
          className="music-player-slider"
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="music-player-queue-section">
        <input
          type="text"
          placeholder="Add YouTube URL to queue"
          value={nextUrl}
          onChange={(e) => setNextUrl(e.target.value)}
          className="music-player-next-input"
        />
        <button
          onClick={handleAddToQueue}
          disabled={queue.length >= 10 || !nextUrl}
          className="music-player-button"
        >
          Add to Play Next
        </button>

        {queue.length > 0 && (
          <div className="music-player-queue-list">
            <h4 style={{ color: "#ccc" }}>Up Next:</h4>
            <ol>
              {queue.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <ReactPlayer
        key={playerKey}
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls={false}
        width="0"
        height="0"
        style={{ display: "none" }}
        onDuration={(d) => setDuration(d)}
        onProgress={({ playedSeconds }) => {
          if (!seeking) setPlayed(playedSeconds);
        }}
        onEnded={handleEnded}
        config={{
          youtube: {
            playerVars: { autoplay: 1 },
          },
        }}
      />
    </div>
  );
};

export default MusicPlayer;
