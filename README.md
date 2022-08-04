Front end
For this project we use NextJS.

1. Start NextJS project: yarn create next-app .("." means in this folder)
2. To start server: yarn run dev
3. Create Components folder for components
4. Add Moralis: yarn add moralis react-moralis (without "dev" as it's not only for developers). It's a react component around moralis project
   https://www.npmjs.com/package/react-moralis - good description of how to use
   https://docs.moralis.io/introduction/readme#user

Then we need to wrap our code with <MoralisProvider> in \_app.js. This let your components have access to Moralis functions. After we can use hooks in app:

- useMoralis for authentication and user data
- useMoralisQuery for easy query
- useMoralisCloudFunction for easy cloud functions
- useMoralisSubscription for easy subscription
- useMoralisFile for easy file uploads
  In <MoralisProveder> we need to specify appId and serverUrl, or use initializeOnMount = {false} to do it manually

And then we can call hooks inside app.

5.  Install web3uikit: yarn add web3uikit
    By some reason it's installing wrong version of web3uikit, so i add string in package.json - dependencies section: "web3uikit": "^0.1.159" and then cmd: "yarn install"

6.  Additionally we want to use Notifications in code. For this in \_app.js: "import {NotificationsProvider} from "web3uikit" " and wrap all the code in it with "Notification Provider"
    Then we use hook: "useNotification". import {useNotification} from "web3uikit"
    and then in the code "const dispatch = useNotification()"
    And this:
    await enterRaffle({
    // onComplete:
    // onError:
    onSuccess: handleSuccess,
    onError: (error) => console.log(error),
    })

    - const handleSuccess = async function (tx){
      await tx.wait(1)
      handleNewNotification(tx)
      }

    Note: OnSuccess means that transaction is sent to MetaMask, that's why we wait for tx confirmation.

7.  For formatting we install tailwindcss: "yarn add --dev tailwindcss postcss autoprefixer"
    After init it: "yarn tailwindcss init -p"
    Then configure template paths in tailwind.config.js and postcss.config.js
    Add tailwind directives to css project in: "./styles/globals.css"
    Then: "yarn dev"
    nextJS guide: https://tailwindcss.com/docs/guides/nextjs

8.  To use "useWeb3Contract" from Moralis we need to pass ABI and contactAddress. It should be done via "update-front-end.js" script
    abi.json and addresses.json will be saved in "constants" folder

Interaction with contract:

1. Getting chainId and contract address:
   // take chainId from Moralis and rename it to chainIdHex (it's stored in HEX in Moralis)
   const { chainId: chainIdHex } = useMoralis();
   // and convert it to integer
   const chainId = parseInt(chainIdHex);
   // take lottery address from contractAddress file for actual chainId
   const lotteryAddress =
   chainId in contractAddresses ? contractAddresses[chainId][0] : null;

2. To execute on-chain functions we can use useWeb3Contract() hook:
   Options:
   address : The contract address (i.e. 0x1a2b3x...).
   functionName : The name of the contract's function that you want to call.
   abi : The contract's abi.
   params (optional): Any parameter you want to send with the function.

   Example:
   const {
   runContractFunction: enterLottery,
   error: enterTxError,
   data: enterTxResponse,
   isLoading,
   isFetching,
   } = useWeb3Contract({
   abi: abi,
   contractAddress: lotteryAddress,
   functionName: "enter",
   // no params
   params: {},
   msgValue: entranceFee,
   })

   Responses:
   To handle responses of different async methods we can read the data directly from the hook. The data will return error, data, isLoading, isFetching. They can be easily used to conditionally render different parts of app.
   The other logic is to listen directly for success/error responses. This is facilitated by passing one or more callback (onComplete, onError and/or onSuccess) to the function:

   - onSuccess Fires when the request resolves successfully. If possible it is returned with the resolved data.
   - onError Fires when the request returns an error. It will return the corresponding error.
   - onComplete Fires when a request finishes (regardless of a success/error response)

3. Use of notifications:
   In the code:

   import { useNotification } from "web3uikit"

   const dispatch = useNotification()

   const handleSuccess = async function (tx) {
   await tx.wait(1);
   //updateUIValues();
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

   In the return function we have button and OnSuccess response:
   <button
   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
   onClick={async () =>
   await enterRaffle({
   // onComplete:
   // onError:
   onSuccess: handleSuccess,
   onError: (error) => console.log(error),
   })
   }
   disabled={isLoading || isFetching} >

4. UseEffect hook in React
   https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
   Purpose of useEffect is check var states after page refresh (for ex, without it after refreshing page "Connect" button always shows "Connect")
   "import {useEffect} from "react""

   Then in code we have "useEffect(() => {}, []". If anything in this [] changes, it will perform {} functions
   useEffect automatically run on load and then it'll run checking the value in []

   If we use it without dependency array - it will run anytime smth re-renders: useEffect(() => {}
   If we use it with blank dependency array - it will run once on load

5. UseState hook in React
   https://reactjs.org/docs/hooks-reference.html#usestate

6. In useMoralis we can use hooks:
   - isWeb3Enabled = Boolean to indicate if web3 has been enabled via the enableWeb3 function
   - chainId = chain id of the blockchain that the web3 wallet is connected to
