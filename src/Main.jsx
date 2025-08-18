import React from "react";
import Navigation from "./components/Navigation";
import Clock from "./components/Clock";
import Player from "./components/Player";
import AudioVisualizer from "./components/AudioVisualizer";
import SongData from "./components/SongData.json";
import Playlist from "./components/Playlist";
import TitleDisplay from "./TitleDisplay";
import LyricsDisplay from "./LyricsDisplay";
import { toFilename } from "./helpers";
import Lyrics from "./components/Lyrics";

const Main = () => {
  const [songIndex, setIndex] = React.useState(0);
  const [player, setPlayer] = React.useState("true");
  const [clock, setClock] = React.useState("true");
  const [audioVis, setAudioVis] = React.useState("true");
  const [mode, setMode] = React.useState(0);
  const [playlist, setPlaylist] = React.useState("true");
  const [hasLyrics, setHasLyrics] = React.useState("true");
  const [shuffle, setShuffle] = React.useState(true);
  const [replay, setReplay] = React.useState(true);
  const [wpePaused, setWPEPaused] = React.useState(false);
  const [songList, setSongList] = React.useState([[], []]);
  const [uiVolume, setUiVolume] = React.useState(0.5);
  const [textSize, setTextSize] = React.useState(1);
  const [titleDisplay, setTitleDisplay] = React.useState(TitleDisplay.English);
  const [lyricsDisplay, setLyricsDisplay] = React.useState(LyricsDisplay.Both);
  const [use24HourClock, set24HourClock] = React.useState(true);
  const audioRef = React.useRef(new Audio());

  const playerHandler = () => {
    //Changes and sets the music player
    setPlayer(player === "true" ? "false" : "true");
    localStorage.setItem("player", player === "true" ? "false" : "true");
  };

  const clockHandler = () => {
    //Changes and sets the clock
    setClock(clock === "true" ? "false" : "true");
    localStorage.setItem("clock", clock === "true" ? "false" : "true");
  };

  const visualizerHandler = () => {
    //Changes and sets the visualizer
    setAudioVis(audioVis === "true" ? "false" : "true");
    localStorage.setItem("audioVis", audioVis === "true" ? "false" : "true");
  };

  const playlistHandler = () => {
    //Changes and sets the playlist
    setPlaylist(playlist === "true" ? "false" : "true");
    localStorage.setItem("playlistH", playlist === "true" ? "false" : "true");
  };

  const lyricsHandler = () => {
    //Toggles the lyrics
    setHasLyrics(hasLyrics === "true" ? "false" : "true");
    localStorage.setItem("railgun-lyrics", hasLyrics === "true" ? "false" : "true");
  };

  const reShuffle = (x, y) => {
    //Replay and Shuffle
    if (x === "shuffle") {
      setShuffle(y);
      setReplay(false);
      localStorage.setItem("railgun-repeat-shuffle", `[${false}, ${y}]`);
    } else {
      setReplay(y);
      setShuffle(false);
      localStorage.setItem("railgun-repeat-shuffle", `[${y}, ${false}]`);
    }
  };

  const getKey = (m) => songList[m - 1].findIndex((x) => x === songIndex + 1);

  const changeSong = (e) => {
    //Changes the song using conditions ~from player
    if (mode === 0) {
      //Default Playlist
      if (shuffle === false) {
        //Shuffle Scuffed mech
        if (e === true) {
          //Skip Button
          if (songIndex + 1 < SongData.length) {
            setIndex(songIndex + 1);
          } else {
            setIndex(0);
          }
        } else if (e === false) {
          //Prev Button
          if (songIndex - 1 < 0) {
            setIndex(SongData.length - 1);
          } else {
            setIndex(songIndex - 1);
          }
        }
      } else {
        setIndex(Math.floor(SongData.length * Math.random()));
      }
    } else if (
      (mode === 1 || mode === 2) &&
      Array.isArray(songList[mode - 1]) &&
      songList[mode - 1].length
    ) {
      //Check if array is empty
      if (shuffle === false) {
        const key = getKey(mode);
        if (e === true) {
          if (key + 1 < songList[mode - 1].length) {
            setIndex(songList[mode - 1][key + 1] - 1);
          } else {
            setIndex(songList[mode - 1][0] - 1);
          }
        } else if (e === false) {
          if (key - 1 < 0) {
            const tempSong = songList[mode - 1];
            const tempId = SongData.findIndex(
              (e) => e.id === tempSong[tempSong.length - 1],
            );
            setIndex(tempId);
          } else {
            setIndex(songList[mode - 1][key - 1] - 1);
          }
        }
      } else {
        //Shuffle, it won't need a key because it's random :>
        setIndex(
          songList[mode - 1][
            Math.floor(songList[mode - 1].length * Math.random())
          ] - 1,
        );
      }
    }
  };

  const addSong = (x, y) => {
    if (songList[y - 1].includes(x)) {
      //Op check
    } else {
      let tempArray = [...songList];
      tempArray[y - 1].push(x);
      setSongList(tempArray);
      localStorage.setItem("railgun-playlist", JSON.stringify(tempArray));
    }
  };

  const removeSong = (y) => {
    songList[y - 1].splice(getKey(y), 1);
    setSongList([...songList]);
    localStorage.setItem("railgun-playlist", JSON.stringify(songList));
  };

  const changeId = (e) => {
    //Change the song through playlist
    setIndex(e);
  };

  const changeMode = (e) => {
    //Changes mode ~the playlist of what the user is using
    setMode(e);
    localStorage.setItem("railgun-mode", e);
  };

  const [prevMode, setPrevMode] = React.useState();

  if (mode !== prevMode) {
    setPrevMode(mode);
    if (mode === 0) {
      setIndex(Math.floor(SongData.length * Math.random()));
    } else if (Array.isArray(songList[mode - 1]) && songList[mode - 1].length) {
      setIndex(
        songList[mode - 1][
        Math.floor(songList[mode - 1].length * Math.random())
        ] - 1,
      );
    }
  }

  React.useEffect(() => {
    //Loads and sets data onstart
    try {
      setAudioVis(
        localStorage.getItem("audioVis") !== null
          ? localStorage.getItem("audioVis")
          : "true",
      );
      setClock(
        localStorage.getItem("clock") !== null
          ? localStorage.getItem("clock")
          : "true",
      );
      setPlayer(
        localStorage.getItem("player") !== null
          ? localStorage.getItem("player")
          : "true",
      );
      setPlaylist(
        localStorage.getItem("playlistH") !== null
          ? localStorage.getItem("playlistH")
          : "true",
      );
      setMode(
        localStorage.getItem("railgun-mode") !== null
          ? parseInt(localStorage.getItem("railgun-mode"))
          : 0,
      );
      setSongList(
        localStorage.getItem("railgun-playlist") !== null
          ? JSON.parse(localStorage.getItem("railgun-playlist"))
          : [[], []],
      );
      setHasLyrics(
        localStorage.getItem("railgun-lyrics") !== null
          ? localStorage.getItem("railgun-lyrics")
          : "true",
      );
      if (localStorage.getItem("railgun-repeat-shuffle") !== null) {
        let temp14 = JSON.parse(localStorage.getItem("railgun-repeat-shuffle"));
        setReplay(temp14[0]);
        setShuffle(temp14[1]);
      } else {
        setReplay(false);
        setShuffle(true);
      }
    } catch (e) {
      setAudioVis("true");
      localStorage.setItem("audioVis", "true");
      setClock("true");
      localStorage.setItem("clock", "true");
      setPlayer("true");
      localStorage.setItem("player", "true");
      setPlaylist("true");
      localStorage.setItem("playlistH", "true");
      setMode(0);
      localStorage.setItem("railgun-mode", 0);
      setSongList([[], []]);
      localStorage.setItem("railgun-playlist", JSON.stringify([[], []]));
      setReplay(false);
      setShuffle(true);
      localStorage.setItem("railgun-repeat-shuffle", JSON.stringify([true, false]));
      localStorage.setItem("railgun-lyrics", "true");
    }
  }, []);

  //Wallpaper Engine Functions
  try {
    window.wallpaperPropertyListener = {
      applyUserProperties: function (properties) {
        if (properties.uiVolume) setUiVolume(properties.uiVolume.value * 0.1);
        if (properties.textsize) setTextSize(properties.textsize.value / 10);
        if (properties.titledisplay) setTitleDisplay(properties.titledisplay.value)
        if (properties.lyricsdisplay) setLyricsDisplay(properties.lyricsdisplay.value)
        if (properties.use24hourclock) set24HourClock(properties.use24hourclock.value)
      },
      setPaused: function (isPaused) {
        setWPEPaused(isPaused);
      },
    };
  } catch (e) {
    console.log(e);
  }

  return (
    <div
      className="Main"
      style={{ backgroundColor: SongData[songIndex].backgroundColor }}
    >
      {audioVis === "true" ? (
        <AudioVisualizer lineColor={SongData[songIndex].lineColor} />
      ) : null}
      <img
        className="mainImage"
        src={`./assets/icons/${
          toFilename(SongData[songIndex].album ?? SongData[songIndex].name)
        }.jpg`}
        alt=""
        style={{ boxShadow: "1px 1px 12px #150625" }}
      />
      <Navigation
        uiVolume={uiVolume}
        playerHandler={playerHandler}
        clockHandler={clockHandler}
        playlistHandler={playlistHandler}
        changeSong={changeSong}
        visualizerHandler={visualizerHandler}
        songIndex={songIndex}
        lyricsHandler={lyricsHandler}
      />
      {playlist === "true" ? (
        <Playlist
          textSize={textSize}
          uiVolume={uiVolume}
          songIndex={songIndex}
          changeId={changeId}
          songList={songList}
          changeMode={changeMode}
          mode={mode}
          addSong={addSong}
          removeSong={removeSong}
          titleDisplay={titleDisplay}
        />
      ) : null}
      {clock === "true" ? (
        <Clock
          textShadow={SongData[songIndex].clockTextShadow}
          textSize={textSize}
          use24HourClock={use24HourClock}
        />
      ) : null}
      {player === "true" ? (
        <Player
          uiVolume={uiVolume}
          playerTextShadow={SongData[songIndex].playerTextShadow}
          songIndex={songIndex}
          changeSong={changeSong}
          shuffle={shuffle}
          replay={replay}
          reShuffle={reShuffle}
          textSize={textSize}
          titleDisplay={titleDisplay}
          audioRef={audioRef}
          wpePaused={wpePaused}
        />
      ) : null}
      {
        hasLyrics === "true" && (
          <Lyrics
            songIndex={songIndex}
            audioRef={audioRef}
            uiVolume={uiVolume}
            lyricsDisplay={lyricsDisplay}
          />
        )
      }
   </div>
  );
};

export default Main;
