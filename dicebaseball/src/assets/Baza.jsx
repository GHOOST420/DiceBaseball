import React, { useEffect, useRef, useState } from "react";

/* eslint-disable no-unused-vars */
function Baza({ baze, setBaze }) {
    var nizBaza = baze;
    const [valDice, setValDice] = useState([0, 0])
    const [bacanje, setBacanje] = useState(false);
    const [imePrvog, setImePrvog] = useState("HOME TEAM");
    const [imeDrugog, setImeDrugog] = useState("AWAY TEAM");
    const [computerTeam, setComputerTeam] = useState(null);
    const [computerTurnTick, setComputerTurnTick] = useState(0);
    const computerTurnPending = useRef(false);
    const pozicijePoIndeksu = {
        0: { row: 2, col: 1 }, // bilo (1, 2) -> sada (2, 1)
        1: { row: 1, col: 2 }, // bilo (2, 1) -> sada (1, 2)
        // ostali indeksi mogu imati svoje koordinate ili ići automatski
    };
    const [imePoziva, setImePoziva] = useState(null);
    const [tabela] = useState({
        // Prva kolona
        '1:1': 'HOME RUN',
        '1:2': 'WALK',
        '1:3': 'GROUND OUT',
        '1:4': 'POP OUT',
        '1:5': 'SINGLE',
        '1:6': 'DOUBLE',
        '2:2': 'STRIKE OUT',

        // Srednja kolona
        '2:3': 'FLY OUT',
        '2:4': 'SINGLE',
        '2:5': 'WALK',
        '2:6': 'DOUBLE',
        '3:3': 'STRIKE OUT',
        '3:4': 'POP OUT',
        '3:5': 'WALK',

        // Treća kolona
        '3:6': 'DOUBLE',
        '4:4': 'STRIKE OUT',
        '4:5': 'SINGLE',
        '4:6': 'GROUND OUT',
        '5:5': 'TRIPLE',
        '5:6': 'FLY OUT',
        '6:6': 'HOME RUN',
    });
    const [rezultat1,setR1] = useState(0);
    const [rezultat2,setR2] = useState(0);
    const [ispad, setIspad] = useState([false, false, false]);
    const [igrac, setIgrac] = useState(false);
    const [devetina, setDevetina] = useState(1);
    const [devetinaPoints, setDevetinaPoints] = useState([]);
    const [checkouts, setChecks] = useState(0);
    const [GameOVer, setGover] = useState(false);



    var diceRoll = () => {
        const prvibroj = Math.floor(Math.random() * 6) + 1;
        const drugibroj = Math.floor(Math.random() * 6) + 1

        if (bacanje) return;
        setBacanje(true);

        setTimeout(() => {
            var niz = [prvibroj, drugibroj];
            setValDice(niz);

            var imeNapada = tabela[prvibroj + ':' + drugibroj]
                || tabela[drugibroj + ':' + prvibroj];

            if (!imeNapada) {
                console.log("Brate nesto se sjebalo");
                setBacanje(false);
                return;
            }

            setImePoziva(imeNapada);
            setBacanje(false);
        }, 700);
    }

    var runner = () => {
        console.log(devetinaPoints);
        switch (imePoziva)
        {
            case "STRIKE OUT":
            case "GROUND OUT":
            case "POP OUT":
            case "FLY OUT": {
                const noviIspad = [...ispad];

                const index = noviIspad.findIndex(value => value === false);

                if (index !== -1) {
                    noviIspad[index] = true;
                }

                if (noviIspad.every(value => value === true)) {
                    setIspad([false, false, false]);
                    setIgrac(!igrac);
                    setBaze([0, 0, 0, 1]);
                } else {
                    setIspad(noviIspad);
                }
                let out = checkouts;
                out += 1;
                if (out == 6)
                {
                    let devetinka = devetina;
                    
                    var tabelaPoints = [[devetinka ], [rezultat1],  [rezultat2]];
                    var prosla_tabela = [...devetinaPoints, tabelaPoints];
                    out = 0;
                    setDevetinaPoints(prosla_tabela);
                    if (devetina == 9) { setGover(true); return; }
                    devetinka += 1;
                    setDevetina(devetinka);
                }
                
                setChecks(out);
                break;
            }
            case "SINGLE": {
                const stareBaze = [...baze];
                const noveBaze = [...baze];

                stareBaze.forEach((value, index) => {
                    if (value !== 0) {
                        if (index !== 3) {
                            noveBaze[index] -= 1;
                        }

                        if (index > 0) {
                            noveBaze[index - 1] += 1;
                        } else {
                            
                            let rez = 0;
                            rez += 1;
                            
                            var stariRez = igrac === true ? rezultat2 : rezultat1;
                            stariRez += rez;
                            igrac === true ? setR2(stariRez): setR1(stariRez);
                        }
                    }
                });

                setBaze(noveBaze);
            }; break;
            case "HOME RUN":
                {
                    let pom = 0;
                    const stareBaze = [...baze];
                    const noveBaze = [...baze];

                    stareBaze.forEach((value, index) => {
                        if (value !== 0) {
                            if (index !== 3) {
                                pom += value;
                                noveBaze[index] = 0;
                            }
                            else
                            {
                                pom += 1;
                            }
                         

                        } 
                    });
                    

                    let rez = 0;
                    rez += pom;

                    var stariRez = igrac === true ? rezultat2 : rezultat1;
                    stariRez += rez;
                    igrac === true ? setR2(stariRez) : setR1(stariRez);
                    setBaze([0, 0, 0, 1]);
                }; break;

            case "WALK":
                break;

            case "DOUBLE":
                {
                    let rez = 0;
                    const stareBaze = [...baze];
                    const noveBaze = [...baze];

                    stareBaze.forEach((value, index) => {
                        if (value !== 0) {
                            if (index !== 3) {
                                noveBaze[index] -= 1;
                            }

                            if (index > 1) {
                                noveBaze[index - 2] += 1;
                            } else {
                                
                                
                                rez += 1;

                                var stariRez = igrac === true ? rezultat2 : rezultat1;
                                stariRez += rez;
                                igrac === true ? setR2(stariRez) : setR1(stariRez);
                            }
                        }
                    });

                    setBaze(noveBaze);
                }; break;

            case "TRIPLE":
                {
                    const stareBaze = [...baze];
                    const noveBaze = [...baze];
                    let rez = 0;

                    stareBaze.forEach((value, index) => {
                        if (value !== 0) {
                            if (index === 3) {
                                noveBaze[0] += value;
                            } else {
                                rez += value;
                                noveBaze[index] = 0;
                            }
                        }
                    });

                    var stariRez = igrac === true ? rezultat2 : rezultat1;
                    stariRez += rez;
                    igrac === true ? setR2(stariRez) : setR1(stariRez);
                    setBaze(noveBaze);
                }; break;
        }
        
        

       
    };

    const computerIsAtBat = computerTeam === (igrac ? "AWAY" : "HOME");

    useEffect(() => {
        if (!computerIsAtBat || GameOVer) {
            return;
        }

        if (!bacanje && !computerTurnPending.current) {
            computerTurnPending.current = true;
            diceRoll();
            return;
        }

        if (computerTurnPending.current && !bacanje && imePoziva) {
            const moveTimer = setTimeout(() => {
                runner();
                computerTurnPending.current = false;
                setComputerTurnTick((tick) => tick + 1);
            }, 2000);

            return () => clearTimeout(moveTimer);
        }
    }, [computerIsAtBat, GameOVer, bacanje, imePoziva, computerTurnTick]);
     
     return (<>
        <div className="scoreboard">
            <div className="team-score">
                <input
                    className="team-name"
                    value={imePrvog}
                    onChange={(event) => setImePrvog(event.target.value)}
                    aria-label="Ime prvog tima"
                />
                <strong>{rezultat1}</strong>
                <span className={`turn-dot ${igrac === false ? "active" : ""}`} />
            </div>
            <div className="scoreboard-center">BASEBALL</div>
            <div className="team-score">
                <span className={`turn-dot ${igrac === true ? "active" : ""}`} />
                <strong>{rezultat2}</strong>
                <input
                    className="team-name"
                    value={imeDrugog}
                    onChange={(event) => setImeDrugog(event.target.value)}
                    aria-label="Ime drugog tima"
                />
            </div>
        </div>
        <div className="computer-controls">
            <button
                className={computerTeam === "HOME" ? "computer-active" : ""}
                onClick={() => {
                    computerTurnPending.current = false;
                    setComputerTeam(computerTeam === "HOME" ? null : "HOME");
                }}
            >
                COMPUTER HOME
            </button>
            <button
                className={computerTeam === "AWAY" ? "computer-active" : ""}
                onClick={() => {
                    computerTurnPending.current = false;
                    setComputerTeam(computerTeam === "AWAY" ? null : "AWAY");
                }}
            >
                COMPUTER AWAY
            </button>
        </div>
        <div className="game-status">
            <span className="status-label">STRIKEOUTS</span>
            <div className="outs-indicator">
                {ispad.map((value, index) => (
                    <span className={`out-dot ${value ? "checked" : ""}`} key={index} />
                ))}
            </div>
            <span className="turn-label">
                AT BAT: {igrac === false ? imePrvog : imeDrugog}
            </span>
        </div>
        <div id="teren">
      <div id="baze" >
          {baze.map((bazaId, index) => {
              const poz = pozicijePoIndeksu[index];
             return index === 0 ? (

                  <React.Fragment key={index}>
                      <div></div>
                       <p className={`bazica ${bazaId === 1 ? "zauzeta-baza" : ""}`} style={{
                           ...(poz
                               ? { gridRow: poz.row, gridColumn: poz.col }
                               : {})
                       }} key={index}>{bazaId}</p>
                      <div></div>
                  </React.Fragment>


              ) : (
                  <React.Fragment key={index}>

                          <p className={`bazica ${bazaId === 1 ? "zauzeta-baza" : ""}`} style={{
                               ...(poz
                                   ? { gridRow: poz.row, gridColumn: poz.col }
                                   : {})
                           }} key={index}>{bazaId}</p>
                      <div></div>
                  </React.Fragment>
              )
          })}
          </div>
      </div>
      <p className="call-result">{imePoziva}</p>
      <div className="game-controls">
          <button onClick={() => (diceRoll())} disabled={bacanje || computerIsAtBat}>THROW DICES</button>
          <button onClick={() => (runner())} disabled={computerIsAtBat}>MOVE</button>
      </div>
        <div className="dice-container">
            {valDice.map((value, index) => (
                <div
                    className={`dice ${bacanje ? "bacanje" : ""}`}
                    key={index}
                >
                    {bacanje ? "?" : value}
                </div>
            ))}
        </div>

        <table className="score-table">
            <tbody>
                <tr>
                    <th>INNING</th>
                    {Array.from({ length: 9 }, (_, i) => (
                        <th key={i}>{i + 1}</th>
                    ))}
                </tr>

                <tr>
                    <th>{imePrvog}</th>
                    {Array.from({ length: 9 }, (_, i) => (
                        <td key={i}>{devetinaPoints[i]?.[1] ?? "-"}</td>
                    ))}
                </tr>

                <tr>
                    <th>{imeDrugog}</th>
                    {Array.from({ length: 9 }, (_, i) => (
                        <td key={i}>{devetinaPoints[i]?.[2] ?? "-"}</td>
                    ))}
                </tr>
            </tbody>
        </table>
  </>
  );
}

export default Baza;