import { useState } from "react";
import * as lotteryJson from "../assets/Lottery.json";
import { parseEther } from "viem";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

export const PurchaseToken = () => {
  const [amount, setAmount] = useState("");

  const { config, error } = usePrepareContractWrite({
    address: "0x6d018d25c62aDC1beD9854ff80420d40A008d87A",
    abi: lotteryJson.abi,
    functionName: "purchaseTokens",
    value: parseEther(amount),
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <div className="card lg:card-side bg-base-300 shadow-xl mb-4">
        <div className="card-body">
          <h2 className="card-title">Purchase Tokens</h2>

          <label className="label">
            <span className="label-text">Amount?</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <button className="btn btn-active btn-neutral" disabled={!write || isLoading} onClick={() => write?.()}>
            {isLoading ? "Buying..." : "Buy"}
          </button>
          {isSuccess && (
            <div>
              Success!
              <div>
                <a target="_blank" href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
                  Etherscan
                </a>
              </div>
            </div>
          )}
          {error && <div>An error occurred preparing the transaction: {error.message}</div>}
        </div>
      </div>
    </div>
  );
};