import SongData from "./SongData.json";
import Series from "../Series";

const SeriesControl = (props) => {
  let keyPress = new Audio();

  const onClick = (newSeries) => {
    keyPress.src = `./assets/audios/notes.mp3`;
    keyPress.volume = props.uiVolume;
    keyPress.play();
    props.changeSeries(newSeries);
  };

  return (
    <div
      className="series-control-container"
      style={{ border: `4.5px solid ${SongData[props.songIndex].lineColor}` }}
    >
      <div style={{
        opacity: ".85",
        height: "100%",
        padding: "5px",
        marginTop: "auto",
        marginBottom: "auto"
      }}>
        {
          Object.keys(Series).map((child, i) => (
            <button
            key={i}
            className="h-1/2 w-1/3"
            onClick={() => onClick(child.toLowerCase())}
            style={{
              backgroundColor: child.toLowerCase() === props.series ? SongData[props.songIndex].lineColor : `transparent`,
              color: child.toLowerCase() === props.series ? SongData[props.songIndex].backgroundColor : `white`,
              borderRadius: "5px",
              fontWeight: child.toLowerCase() === props.series ? "500" : "normal",
            }}
            >
            {child}
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default SeriesControl;
