import { useState } from "react";

const initialTeams = [
  "Troublemakers", "Technocrats", "Auction Kings", "Stravon", "Innovators", 
  "Duovate", "AD", "Stratosphere", "Venture Minds", "Auction Avengers", 
  "Genesis", "Inspira", "Hooligans", "Team ASURA", "Vortex Vanguards"
].map(name => ({
  name,
  balance: 1000,
  purchases: []
}));

const lists = {
  list1: [
    "Teleportation Device", "Time Freeze Watch", "Emotion Reading AI", "Mind Controlled Typing",
    "Personal Gravity Adjuster", "Dream designer and creator", "Neural Uploader", "Nano Healing Suit",
    "Mind sync Chambers", "Weather Controller", "Invisibility Cloak", "Memory Projector",
    "Clone and Merge Tech", "AI Powered Lie Detector", "Super Camouflage Suit", "Universal Translator",
    "Reality Simulator", "Pocket Black Hole"
  ],
  list2: [
    "Disaster Recovery & Evacuation System", "Next-Gen Criminal Investigation", "Immersive Historical Experience", 
    "Intergalactic Travel System", "Advanced Espionage & Surveillance", "Personalized Therapy & Mental Wellness",
    "Ultra-Secure Communication System", "AI-Assisted Education & Learning", "Smart Warfare & Tactical Defense",
    "Next-Gen Entertainment & Gaming", "Medical Miracle Hub", "Space Colonization Support Systems",
    "Perfect Crime Scene Reconstruction", "AI-Powered Diplomacy & Negotiation", "Stealth & Covert Operations",
    "Universal Linguistic & Cultural Bridge", "Hyper-Realistic VR Training & Simulation", "Extreme Energy Source & Containment"
  ]
};

export default function App() {
  const [teams, setTeams] = useState(initialTeams);
  const [currentList, setCurrentList] = useState("list1");
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [bidAmounts, setBidAmounts] = useState(Array(15).fill(0));
  const [unsoldItems, setUnsoldItems] = useState([]);
  const [history, setHistory] = useState([]);

  const auctionItems = lists[currentList];

  const handleBid = (teamIndex) => {
    const bidAmount = parseInt(bidAmounts[teamIndex], 10);
    if (isNaN(bidAmount) || bidAmount <= 0) return;
    
    setHistory([...history, { teams: [...teams], currentItemIndex }]);

    setTeams((prevTeams) => {
      return prevTeams.map((team, index) => {
        if (index === teamIndex && team.balance >= bidAmount) {
          return {
            ...team,
            balance: team.balance - bidAmount,
            purchases: [...team.purchases, auctionItems[currentItemIndex]]
          };
        }
        return team;
      });
    });
    nextItem();
  };

  const handleBidChange = (teamIndex, value) => {
    const newBidAmounts = [...bidAmounts];
    newBidAmounts[teamIndex] = value;
    setBidAmounts(newBidAmounts);
  };

  const nextItem = () => {
    if (currentItemIndex < auctionItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const skipItem = () => {
    setHistory([...history, { teams: [...teams], currentItemIndex }]);
    setUnsoldItems([...unsoldItems, auctionItems[currentItemIndex]]);
    nextItem();
  };

  const goToItem = (index) => {
    setCurrentItemIndex(index);
  };

  const undoLastAction = () => {
    if (history.length > 0) {
      const lastState = history.pop();
      setTeams(lastState.teams);
      setCurrentItemIndex(lastState.currentItemIndex);
      setHistory([...history]);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", padding: "20px", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold" }}>Innovation Auction</h1>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>Current Item: {auctionItems[currentItemIndex]}</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", maxHeight: "65vh", overflowY: "auto" }}>
        {teams.map((team, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>{team.name}</h3>
            <p style={{ fontSize: "18px" }}><b>Balance:</b> {team.balance} credits</p>
            <p style={{ fontSize: "18px" }}><b>Purchases:</b> {team.purchases.join(", ") || "None"}</p>
            <input
              type="number"
              min="1"
              value={bidAmounts[index]}
              onChange={(e) => handleBidChange(index, e.target.value)}
              style={{ marginTop: "5px", padding: "8px", width: "100px" }}
            />
            <button
              style={{ marginTop: "10px", padding: "10px 15px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
              onClick={() => handleBid(index)}
              disabled={teams[index].balance < bidAmounts[index] || bidAmounts[index] <= 0}
            >
              Place Bid
            </button>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={skipItem} style={{ margin: "10px", padding: "12px 25px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>Skip Item</button>
        <button onClick={undoLastAction} style={{ margin: "10px", padding: "12px 25px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>Undo</button>
        <select onChange={(e) => goToItem(parseInt(e.target.value, 10))} style={{ padding: "12px", fontSize: "16px" }}>
          <option value="">Go to Item</option>
          {auctionItems.map((item, index) => (
            <option key={index} value={index}>{item}</option>
          ))}
        </select>
        <select onChange={(e) => setCurrentList(e.target.value)} style={{ padding: "12px", fontSize: "16px" }}>
          <option value="list1">Switch to List 1</option>
          <option value="list2">Switch to List 2</option>
        </select>
      </div>
    </div>
  );
}