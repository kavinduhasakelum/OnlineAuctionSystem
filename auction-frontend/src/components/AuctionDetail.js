import React from 'react';
import { useParams } from 'react-router-dom';

const AuctionDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="container mt-4">
      <h1>Auction Details - Item #{id}</h1>
      <div className="alert alert-info">
        Auction detail page will show individual auction with bidding functionality
      </div>
    </div>
  );
};

export default AuctionDetail;
