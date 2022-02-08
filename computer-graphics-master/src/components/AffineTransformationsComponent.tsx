import React, {useState, useEffect} from "react";
import {Arrow, Layer, Line, RegularPolygon, Stage, Text} from "react-konva";
import Point from "../utils/Point";
import Konva from "konva";
import {MDBBtn, MDBContainer} from "mdbreact";
import ReactTooltip from "react-tooltip";


interface AffineProps {
  height: number,
  width: number
}

function multiplyMatrix(a: number[][], b: number[][]) {
  const m = new Array(a.length)
  for (let r = 0; r < a.length; ++r) {
      m[r] = new Array(b[0].length);
      for (let c = 0; c < b[0].length; ++c) {
          m[r][c] = 0;
          for (let i = 0; i < a[0].length; ++i) {
              m[r][c] += a[r][i] * b[i][c];
          }
      }
  }
  return m;
}

function degreesToRadians(degrees: number)
{
    const pi = Math.PI;
    return degrees * (pi/180);
}

const AffineTransformationsComponent: React.FC<AffineProps> = (props: AffineProps) => {

  const [snapSize, setSnapSize] = useState(50);

  const gridLayerRef = React.useRef<Konva.Layer>(null);
  const hexagonRef = React.useRef<Konva.RegularPolygon>(null);
  const hexagonLineRef = React.useRef<Konva.Line>(null);

  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [radius, setRadius] = useState(50);
  const [displayedRadius, setDisplayedRadius] = useState(1)
  const [rotationAngle, setRotationAngle] = useState(90);
  const [scale, setScale] = useState(2);
  const [hexagonPoint, setHexagonPoint] = useState(new Point(x, y));
  
  let deg = rotationAngle;
  let i = 0;
  let spin = setInterval(()=>{},0)

useEffect(() => {
  if(i === deg) {
      clearInterval(spin);
      i = 0;
  }
}, [i])
  useEffect(() => {
    setHexagonPoint(new Point(x, y))
  }, [x, y])
  useEffect(() => {
    setHexagonPoints([[translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y + radius, 1],
    [translatePoint(hexagonPoint).x + radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y + radius / 2, 1],
    [translatePoint(hexagonPoint).x + radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y - radius / 2, 1],
    [translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y - radius, 1],
    [translatePoint(hexagonPoint).x - radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y - radius / 2, 1],
    [translatePoint(hexagonPoint).x - radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y + radius / 2, 1],
    [translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y, 1]
   ])
}, [hexagonPoint, radius])

  const translatePoint = (point: Point, gridSnapSize = snapSize): Point => {
    return new Point(props.width / 2 + point.x * gridSnapSize, props.height / 2 - point.y * gridSnapSize);
  }

  const [hexagonPoints, setHexagonPoints] = useState([[translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y + radius, 1],
  [translatePoint(hexagonPoint).x + radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y + radius / 2, 1],
  [translatePoint(hexagonPoint).x + radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y - radius / 2, 1],
  [translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y - radius, 1],
  [translatePoint(hexagonPoint).x - radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y - radius / 2, 1],
  [translatePoint(hexagonPoint).x - radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y + radius / 2, 1],
  [translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y, 1]
 ])

 const changeY = (_y: number) => {
  console.log("something changed");
  setY(_y);
  
}
const changeX = (_x: number) => {
  console.log("something changed");
  setX(_x);
}

  const [hexagonCenter, setHexagonCenter] = useState(translatePoint(hexagonPoint));

  const changeRadius = (r: number) => {
    setRadius(r * snapSize);
    setDisplayedRadius(r);
    setHexagonPoints([[translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y + radius, 1],
    [translatePoint(hexagonPoint).x + radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y + radius / 2, 1],
    [translatePoint(hexagonPoint).x + radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y - radius / 2, 1],
    [translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y - radius, 1],
    [translatePoint(hexagonPoint).x - radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y - radius / 2, 1],
    [translatePoint(hexagonPoint).x - radius * Math.sqrt(3)/2, translatePoint(hexagonPoint).y + radius / 2, 1],
    [translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y, 1]]);
  }
  
  const [moveMatrix, setMoveMatrix] = useState([[1, 0, 0], 
                                                [0, 1, 0],
                                                [-translatePoint(hexagonPoint).x, -translatePoint(hexagonPoint).y, 1]]);

  const [movebackMatrix, setMoveBackMatrix] = useState([[1, 0, 0], 
                                                        [0, 1, 0],
                                                [translatePoint(hexagonPoint).x, translatePoint(hexagonPoint).y, 1]]);
                                            
  let scaleMatrix = [[scale, 0, 0], 
                     [0, scale, 0], 
                     [0, 0, 1]];
  
  const [rotateMatrix, setRotateMatrix] = useState( [[Math.cos(degreesToRadians(rotationAngle)), Math.sin(degreesToRadians(rotationAngle)), 0],
                      [-Math.sin(degreesToRadians(rotationAngle)), Math.cos(degreesToRadians(rotationAngle)), 0],
                      [0, 0, 1]]);
             
  const gridLines = (): Konva.Line[] => {

    let lines = new Array<Konva.Line>();

    for (let i = 0; i < (props.width / 2) / snapSize; i++) {
      lines.push(new Konva.Line({
        id: `y-neg-${i}`,
        points: [props.width / 2 - Math.round(i * snapSize), 0, props.width / 2 - Math.round(i * snapSize), props.height],
        stroke: 'hsl(0, 0%, 80%)',
        strokeWidth: 1,
      }));

      lines.push(new Konva.Line({
        id: `y-pos-${i}`,
        points: [props.width / 2 + Math.round(i * snapSize), 0, props.width / 2 + Math.round(i * snapSize), props.height],
        stroke: 'hsl(0, 0%, 80%)',
        strokeWidth: 1,
      }));
    }

    for (let j = 0; j < (props.height / 2) / snapSize; j++) {
      lines.push(new Konva.Line({
        id: `x-pos-${j}`,
        points: [0, props.height / 2 - Math.round(j * snapSize), props.width, props.height / 2 - Math.round(j * snapSize)],
        stroke: 'hsl(0, 0%, 80%)',
        strokeWidth: 1,
      }));

      lines.push(new Konva.Line({
        id: `x-neg-${j}`,
        points: [0, props.height / 2 + Math.round(j * snapSize), props.width, props.height / 2 + Math.round(j * snapSize)],
        stroke: 'hsl(0, 0%, 80%)',
        strokeWidth: 1,
      }));
    }
    return lines;
  }

  const handleClick = () => {

    //const tweenDuration = 5;
    //let hexagonLine = hexagonLineRef.current!;
    //const updatedSnapSize = snapSize / Math.sqrt(scale);
    // const snapSizeDifference = (updatedSnapSize - snapSize) / 60 / tweenDuration;
    console.log(hexagonPoints);
    deg = rotationAngle;
    spin = setInterval(() => {
      setRotateMatrix([[Math.cos(degreesToRadians(i)), Math.sin(degreesToRadians(i)), 0],
          [-Math.sin(degreesToRadians(i)), Math.cos(degreesToRadians(i)), 0],
          [0, 0, 1]]);
      console.log(rotateMatrix);
      let newPoints = hexagonPoints;
      let moveAndRotate = multiplyMatrix(moveMatrix, rotateMatrix);
      let scaleAndRotate = multiplyMatrix(moveAndRotate, scaleMatrix);
      let transformMatrix = multiplyMatrix(scaleAndRotate, movebackMatrix);
      setHexagonPoints(multiplyMatrix(newPoints, transformMatrix));
      setHexagonCenter(new Point((hexagonPoints[0][0] + hexagonPoints[3][0])/2, (hexagonPoints[0][1] + hexagonPoints[3][1])/2));
      console.log(rotationAngle);
      i += 3
    }, 500)
    console.log(hexagonPoints);
    console.log(hexagonCenter);
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    var pointNumber = -1;
    console.log(event.target.value);
      switch (event.target.value) {
      case "center": {
        pointNumber = 6;
        break;
      }
      case "a": {
        pointNumber = 0;
        break;
      }
      case "b": {
        pointNumber = 1;
        break;
      }
      case "c": {
        pointNumber = 2;
        break;
      }
      case "d": {
        pointNumber = 3;
        break;
      }
      case "e": {
        pointNumber = 4;
        break;
      }
      case "f": {
        pointNumber = 5;
        break;
      }
    }
    if (pointNumber > -1) {
      setMoveMatrix([[1, 0, 0], 
        [0, 1, 0],
        [-hexagonPoints[pointNumber][0], -hexagonPoints[pointNumber][1], 1]]);
      setMoveBackMatrix([[1, 0, 0], 
        [0, 1, 0],
        [hexagonPoints[pointNumber][0], hexagonPoints[pointNumber][1], 1]]);
    }
  };

  enum RotationOrigin {
    Center,
    A,
    B,
    C,
    D,
    E,
    F
  }

  const RotationOrigins = {
    center: {
      id: RotationOrigin.Center,
      name: `O`
    },
    a: {
      id: RotationOrigin.A,
      name: `A`
    },
    b: {
      id: RotationOrigin.B,
      name: `B`
    },
    c: {
      id: RotationOrigin.C,
      name: `C`
    },
    d: {
      id: RotationOrigin.D,
      name: `D`
    },
    e: {
      id: RotationOrigin.E,
      name: `E`
    },
    f: {
      id: RotationOrigin.F,
      name: `F`
    }
  };


  return (
    <MDBContainer className="text-center">
      <div>
        <Stage className="my-4" width={800} height={800}>
          <Layer ref={gridLayerRef}>
            {gridLines().map(item => (
              <Line
                key={item.id()}
                name={item.id()}
                points={item.points()}
                stroke={item.stroke()}
                strokeWidth={item.strokeWidth()}/>
            ))}
          </Layer>
          <Layer>
            <Arrow
              points={[props.width / 2, props.height, props.width / 2, 0]}
              fill={'#2e2e2e'}
              stroke={'#2e2e2e'}
              strokeWidth={1}/>
            <Arrow
              points={[0, props.height / 2, props.width, props.height / 2]}
              fill={'#2e2e2e'}
              stroke={'#2e2e2e'}
              strokeWidth={1}/>
            <Line
              points={[props.width / 2 + snapSize, props.height / 2 + 5, props.width / 2 + snapSize, props.height / 2 - 5]}
              fill={'#2e2e2e'}
              stroke={'#2e2e2e'}
              strokeWidth={1}/>
            <Line
              points={[props.width / 2 - 5, props.height / 2 - snapSize, props.width / 2 + 5, props.height / 2 - snapSize]}
              fill={'#2e2e2e'}
              stroke={'#2e2e2e'}
              strokeWidth={1}/>
            <Text
              x={props.width - 20}
              y={props.height / 2 + 15}
              text={'x'}
              fontSize={14}
              fontStyle={'bold'}
              fill={'#2e2e2e'}/>
            <Text
              x={props.width / 2 - 20}
              y={10}
              text={'y'}
              fontSize={14}
              fontStyle={'bold'}
              fill={'#2e2e2e'}/>
            <Text
              x={props.width / 2 - 20}
              y={props.height / 2 + 15}
              text={'0'}
              fontSize={14}
              fontStyle={'bold'}
              fill={'#2e2e2e'}/>
            <Text
              x={props.width / 2 + snapSize - 10}
              y={props.height / 2 + 15}
              text={'1.0'}
              fontSize={14}
              fontStyle={'bold'}
              fill={'#2e2e2e'}/>
            <Text
              x={props.width / 2 - 33}
              y={props.height / 2 - snapSize - 5}
              text={'1.0'}
              fontSize={14}
              fontStyle={'bold'}
              fill={'#2e2e2e'}/>
          </Layer>
          <Layer>
            <Line
              ref = {hexagonLineRef}
              points={[hexagonPoints[0][0], hexagonPoints[0][1],
                hexagonPoints[1][0], hexagonPoints[1][1],
                hexagonPoints[2][0], hexagonPoints[2][1],
                hexagonPoints[3][0], hexagonPoints[3][1],
                hexagonPoints[4][0], hexagonPoints[4][1], 
                hexagonPoints[5][0], hexagonPoints[5][1],
                hexagonPoints[0][0], hexagonPoints[0][1],
                hexagonPoints[6][0], hexagonPoints[6][1]]}
                stroke={"red"}/>
          </Layer>
          <Layer>
            
          </Layer>
        </Stage>
      </div>

      <MDBContainer className="text-center">
        <div className="d-flex flex-column">
          <div className="mt-2 text-left">
            <h3>Origin position <i className="fas fa-question-circle fa-xs"
                                   data-tip="Set the center coordinates of the hexagon"/></h3>
            <ReactTooltip place="right" effect="solid"/>
          </div>
          <div className="row">
            <div className="col text-left">
              <div className="form-group">
                <label>x</label>
                <input type="number" className="form-control" value={x}
                       onChange={(e) => changeX(parseInt(e.target.value))}/>
              </div>
            </div>
            <div className="col text-left">
              <div className="form-group">
                <label>y</label>
                <input type="number" className="form-control" value={y}
                       onChange={(e) => changeY(parseInt(e.target.value))}/>
              </div>
            </div>
          </div>

          <div className="mt-2 text-left">
            <h3>Hexagon radius <i className="fas fa-question-circle fa-xs" data-tip="Set the hexagon radius"/></h3>
            <ReactTooltip place="right" effect="solid"/>
          </div>
          <div className="row">
            <div className="col text-left">
              <div className="form-group">
                <input type="number" className="form-control" value={displayedRadius}
                       onChange={(e) => changeRadius(parseInt(e.target.value))}/>
              </div>
            </div>
          </div>

          <div className="mt-2 text-left">
            <h3>Rotation origin <i className="fas fa-question-circle fa-xs" data-tip="Choose the point you want the hexagon to rotate around"/></h3>
            <ReactTooltip place="right" effect="solid"/>
          </div>
          <div className="row">
            <div className="col text-left">
              <div className="form-group">
                <select className="custom-select" onChange={handleChange} name="rotation-origin">
                  {Object.keys(RotationOrigins).map(key => (
                    <option key={key} value={key}>
                      {RotationOrigins[key].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-2 text-left">
            <h3>Rotation angle <i className="fas fa-question-circle fa-xs" data-tip="Set the rotation angle magnitude of the hexagon transformation"/></h3>
            <ReactTooltip place="right" effect="solid"/>
          </div>
          <div className="row">
            <div className="col text-left">
              <div className="form-group">
                <input type="number" className="form-control" defaultValue={rotationAngle}
                       onChange={(e) => setRotationAngle(parseInt(e.target.value))}/>
              </div>
            </div>
          </div>

          <div className="mt-2 text-left">
            <h3>Hexagon scale <i className="fas fa-question-circle fa-xs" data-tip="Set scale coefficient of the hexagon transformation"/></h3>
            <ReactTooltip place="right" effect="solid"/>
          </div>
          <div className="row">
            <div className="col text-left">
              <div className="form-group">
                <input type="number" className="form-control" placeholder="2" defaultValue={scale}
                       onChange={(e) => setScale(parseInt(e.target.value))}/>
              </div>
            </div>
          </div>

          <div className="mt-2 text-left">
            <MDBBtn color="elegant" block onClick={handleClick}>Transform</MDBBtn>
          </div>
        </div>
      </MDBContainer>
    </MDBContainer>
  );
};

export default AffineTransformationsComponent;