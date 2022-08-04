import { contractAddresses, abi } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function Lottery() {
  // take chainId from Moralis and rename it to chainIdHex (it's stored in HEX in Moralis)
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  // and convert it to integer
  const chainId = parseInt(chainIdHex);
  // take lottery address from contractAddress file for actual chainId
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState("0");
  const [prizePool, setPrizePool] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");

  console.log(entranceFee);

  const dispatch = useNotification();

  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enter",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getPlayersNumber } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getPlayersNumber",
    params: {},
  });

  const { runContractFunction: getPrizePool } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "prizePool",
    params: {},
  });

  async function updateUIValues() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getPlayersNumber()).toString();
    const prizePoolFromCall = (await getPrizePool()).toString();
    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numPlayersFromCall);
    setPrizePool(prizePoolFromCall);
  }

  // After we connect to wallet, we are performing functions in {} // updateUIValues here
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    updateUIValues();
    handleNewNotification(tx);
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR", //Top right corner
      icon: "bell",
    });
  };

  return (
    <div className="p-5">
      {lotteryAddress ? (
        <>
          <h1 className="text-center font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            <div className="ml-auto">PRIZE POOL</div>
            <div>
              {ethers.utils.formatUnits(prizePool, "ether").substring(0, 10)}{" "}
              ETH
            </div>
          </h1>
          <div className="grid justify-center">
            <button
              className=" bg-blue-500 hover:bg-blue-700 text-white text-5xl font-bold py-10 px-10 rounded ml-auto"
              onClick={async () =>
                await enterLottery({
                  // onComplete:
                  // onError:
                  onSuccess: handleSuccess,
                  onError: (error) => console.log(error),
                })
              }
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
              ) : (
                "Jump IN"
              )}
            </button>
          </div>
          <div className="pt-20 bottom-full grid place-content-end">
            <div>
              Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </div>
            <div>The current number of players is: {numberOfPlayers}</div>
            <div>
              Actual prize pool is:{" "}
              {ethers.utils.formatUnits(prizePool, "ether")}
              ETH
            </div>
          </div>
        </>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </div>
  );
}
