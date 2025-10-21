import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const BuyerHome = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await api.get("/auctions");
        setAuctions(response.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">{auction.title}</h2>
            <p className="text-gray-600">{auction.description}</p>
            <p className="mt-2 font-medium">Starting Bid: ${auction.startingPrice}</p>
            <Link
              to={`/auctions/${auction.id}`}
              className="mt-3 inline-block text-blue-500 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerHome;
