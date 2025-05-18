import React, { useState, useRef, useEffect } from "react";
import "./LocalMusicPlayer.css";

const songList = [
  { title: "Buyno Golave", file: "buynogolave.mp3" },
  { title: "Hep Mi Ben", file: "HepMiBen_.mp3" },
  { title: "Mood Boost", file: "moodboost1.mp3" },
];

const LocalMusicPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [currentIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (audio) {
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleNext = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % songList.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex((prev) =>
      prev === 0 ? songList.length - 1 : prev - 1
    );
  };

  const handleSelectSong = (index) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsPlaying(false);
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 100);
  };

  return (
    <div className="local-player-wrapper">
      <div className="library">
        <h3>🎵 Library</h3>
        <ul>
          {songList.map((song, index) => (
            <li
              key={index}
              className={index === currentIndex ? "active" : ""}
              onClick={() => handleSelectSong(index)}
            >
              {song.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="local-player-container">
        <h2>{songList[currentIndex].title}</h2>

        <audio
          ref={audioRef}
          src={`/music/${songList[currentIndex].file}`}
          onEnded={handleNext}
        />

        <div className="controls">
          <button onClick={handlePrev}>⏮️</button>
          <button onClick={togglePlay}>{isPlaying ? "⏸️" : "▶️"}</button>
          <button onClick={handleNext}>⏭️</button>
        </div>

        <div className="progress">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            step="0.1"
            onChange={handleSeek}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default LocalMusicPlayer;
