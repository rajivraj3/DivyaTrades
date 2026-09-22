import React, { useState } from "react";

const initialFunds = {
  availableMargin: 4043.1,
  usedMargin: 3757.3,
  availableCash: 4043.1,
  openingBalance: 4043.1,
  openingBalance2: 3736.4,
  payin: 4064.0,
  span: 0.0,
  deliveryMargin: 0.0,
  exposure: 0.0,
  optionsPremium: 0.0,
  collateralLiquid: 0.0,
  collateralEquity: 0.0,
  totalCollateral: 0.0,
};

const Funds = () => {
  const [funds, setFunds] = useState(initialFunds);
  const [transactionType, setTransactionType] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleOpenTransaction = (type) => {
    setTransactionType(type);
    setAmount("");
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (transactionType === "withdraw" && numericAmount > funds.availableCash) {
      setMessage("Withdrawal amount cannot be greater than available cash.");
      return;
    }

    setFunds((prev) => {
      if (transactionType === "add") {
        return {
          ...prev,
          availableMargin: Number((prev.availableMargin + numericAmount).toFixed(2)),
          availableCash: Number((prev.availableCash + numericAmount).toFixed(2)),
          openingBalance: Number((prev.openingBalance + numericAmount).toFixed(2)),
          openingBalance2: Number((prev.openingBalance2 + numericAmount).toFixed(2)),
          payin: Number((prev.payin + numericAmount).toFixed(2)),
        };
      }

      return {
        ...prev,
        availableMargin: Number((prev.availableMargin - numericAmount).toFixed(2)),
        availableCash: Number((prev.availableCash - numericAmount).toFixed(2)),
        openingBalance: Number((prev.openingBalance - numericAmount).toFixed(2)),
        openingBalance2: Number((prev.openingBalance2 - numericAmount).toFixed(2)),
        payin: Number((prev.payin - numericAmount).toFixed(2)),
      };
    });

    setMessage(
      transactionType === "add"
        ? `₹${numericAmount.toFixed(2)} added successfully.`
        : `₹${numericAmount.toFixed(2)} withdrawn successfully.`
    );
    setTransactionType(null);
    setAmount("");
  };

  const formatCurrency = (value) => Number(value).toFixed(2);

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <button type="button" className="btn btn-green" onClick={() => handleOpenTransaction("add")}>
          Add funds
        </button>
        <button type="button" className="btn btn-blue" onClick={() => handleOpenTransaction("withdraw")}>
          Withdraw
        </button>
      </div>

      {transactionType && (
        <div className="funds-modal" style={{ margin: "20px 0", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#f9f9f9" }}>
          <h4 style={{ marginBottom: "15px" }}>
            {transactionType === "add" ? "Add Funds" : "Withdraw Funds"}
          </h4>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", flex: "1", minWidth: "180px" }}
            />
            <button type="submit" className="btn btn-blue">
              {transactionType === "add" ? "Confirm Add" : "Confirm Withdraw"}
            </button>
            <button type="button" className="btn btn-grey" onClick={() => setTransactionType(null)}>
              Cancel
            </button>
          </form>
          {message && <p style={{ marginTop: "12px", color: "#1f7a1f" }}>{message}</p>}
        </div>
      )}

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{formatCurrency(funds.availableMargin)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">{formatCurrency(funds.usedMargin)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{formatCurrency(funds.availableCash)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>{formatCurrency(funds.openingBalance)}</p>
            </div>
            <div className="data">
              <p>Opening Balance</p>
              <p>{formatCurrency(funds.openingBalance2)}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>{formatCurrency(funds.payin)}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>{formatCurrency(funds.span)}</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>{formatCurrency(funds.deliveryMargin)}</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>{formatCurrency(funds.exposure)}</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>{formatCurrency(funds.optionsPremium)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>{formatCurrency(funds.collateralLiquid)}</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>{formatCurrency(funds.collateralEquity)}</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>{formatCurrency(funds.totalCollateral)}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <button type="button" className="btn btn-blue">
              Open Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
