"use client";
import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import Background from "../public/images/BG.jpg";
import { fetchWithRetry } from "../components/fetchWithRetry";

export default function Home() {
  const [walletKey, setwalletKey] = useState("");
  const [nativeBalance, setNativeBalance] = useState("0");
  const [nftCount, setNftCount] = useState(0);
  const [nftNames, setNftNames] = useState<
    { name: string; description: string; image: string }[]
  >([]);

  const balanceString = nativeBalance?.toString();

  const getBalance = async () => {
    if (!walletKey) {
      window.alert("Wallet key is empty. Please enter a valid wallet key.");
      return;
    }

    try {
      const balance = await fetchWithRetry(
        `https://blokc-backend-challenge.onrender.com/balance/${walletKey}`
      );
      if (!balance.ok) {
        throw new Error("Failed to fetch balance");
      }

      const dataBalance = await balance.json();

      const roundedBalance = parseFloat(
        dataBalance.balanceInEth.balanceInEth
      ).toFixed(4);

      setNativeBalance(roundedBalance);
      console.log(nativeBalance);
    } catch (error) {
      window.alert(
        "Failed to fetch balance. Please check your wallet address."
      );
      console.error("Error fetching balance:", error);
    }
  };

  const getNfts = async () => {
    if (!walletKey) {
      window.alert("Wallet key is empty. Please enter a valid wallet key.");
      return;
    }

    try {
      const NFTs = await fetchWithRetry(
        `https://blokc-backend-challenge.onrender.com/nft/${walletKey}`
      );
      if (!NFTs.ok) {
        throw new Error("Failed to fetch NFTs");
      }

      const responseData = await NFTs.json();

      if (
        !responseData ||
        !responseData.nfts ||
        !responseData.nfts.nfts ||
        !Array.isArray(responseData.nfts.nfts)
      ) {
        throw new Error(
          "Unexpected response format. Expected an array of NFTs."
        );
      }
      const dataNFTs = responseData.nfts.nfts;

      const nftDetails = dataNFTs.map((nft: any) => {
        const { name, metadata } = nft;
        const nftName = metadata?.name || name;
        const nftDescription = metadata?.description || "";
        const nftImage = metadata?.image || "";
        return { name: nftName, description: nftDescription, image: nftImage };
      });

      setNftCount(dataNFTs.length);
      setNftNames(nftDetails);

      console.log("NFT Details", nftDetails);
      console.log("Count", nftDetails.length);
    } catch (error) {
      window.alert("Failed to fetch NFTs. Please check your wallet address.");
      console.error("Error fetching NFTs:", error);
    }
  };

  const walletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setwalletKey(inputValue);
    console.log(inputValue);
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "80%",
        overflow: "hidden",
      }}
    >
      <div className="text-white relativ grid text-center lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left bg-black bg-opacity-50">
        <div className="flex lg:flex justify-center items-center lg:justify-start lg:items-start p-4 ">
          <Image
            src="/images/arbitrum.png"
            alt="Left Image"
            width={60}
            height={60}
            className=""
          />
          <div className="">
            <h1 className="font-sans font-bold text-2xl">Arbitrum</h1>
            <h1 className="font-sans font-bold text-2xl">Fetcher</h1>
          </div>
        </div>

        <div className="lg:ml-auto ml-0 items-center  p-4 lg:mr-10">
          <input
            type="text"
            className="mt-2 border rounded-md p-2 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent lg:w-96 w-1/2"
            value={walletKey}
            onChange={(e) => walletChange(e)}
            placeholder="Enter wallet address here"
            style={{ color: "black" }}
          />
        </div>

        <div className="lg:ml-auto ml-0 flex justify-center items-center  p-4 ">
          <span className="font-sans font-bold text-2xl">
            Balance: {balanceString}&nbsp;
          </span>
          <p className="font-sans text-white text-2xl"></p>
          <button
            onClick={() => {
              getBalance();
            }}
          >
            <Image
              src="/images/refresh.svg"
              alt="Left Image"
              width={20}
              height={20}
              className="ml-4 mt-1"
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <button
          onClick={() => {
            getNfts();
          }}
          className="mt-4 text-white font-sans font-bold text-2xl rounded-lg p-4 bg-black bg-opacity-30 transition duration-200 ease-in-out hover:bg-opacity-50 hover:shadow-lg "
        >
          Fetch NFTs
        </button>
      </div>

      <div className="mr-10 ml-10 ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {nftNames.map((nft, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:-translate-y-2 transition duration-300 ease-in-out hover:shadow-inner"
            >
              <div className="flex justify-center">
                <Image
                  src={`https://ipfs.infura.io/ipfs/${
                    nft.image.split("://")[1]
                  }`}
                  alt={nft.name}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg"
                />
              </div>

              {/* NFT Details */}
              <div className="mt-4">
                <h3 className="text-lg text-black font-semibold">{nft.name}</h3>
                <p className="mt-2 text-gray-600">{nft.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
