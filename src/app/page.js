"use client";
import { useEffect, useState } from "react";
import Web3 from "web3";

export default function Home() {
  const exampleAbi = [
    {
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "content",
          type: "string",
        },
        {
          indexed: true,
          internalType: "string",
          name: "tag",
          type: "string",
        },
      ],
      name: "NewPost",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "content",
          type: "string",
        },
        {
          internalType: "string",
          name: "tag",
          type: "string",
        },
      ],
      name: "post",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const [web3, setWeb3] = useState(undefined);
  const [userAddress, setUserAddress] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [totalPosts, setTotalPosts] = useState(0);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostTag, setNewPostTag] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    connectWeb3();
    // Fetch posts when component mounts
    if (contract) {
      fetchPosts();
    }
  }, [contract]);

  const connectWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        const contractAddress = "0x658D65d31611532133C84cD90F6D367693152db0"; // Replace with your contract address
        const contract = new web3.eth.Contract(exampleAbi, contractAddress);
        setWeb3(web3);
        setUserAddress(userAddress);
        setContract(contract);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error(
        "Web3 not found. Please make sure MetaMask is installed and enabled."
      );
    }
  };

  const fetchPosts = async () => {
    const total = await contract.methods.getTotalPosts().call();
    setTotalPosts(total);

    const postsArray = [];
    for (let i = 0; i < total; i++) {
      const post = await contract.methods.getPost(i).call();
      postsArray.push(post);
    }
    setPosts(postsArray);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (newPostText && newPostTag) {
      try {
        await contract.methods
          .post(newPostText, newPostTag)
          .send({ from: userAddress });
        // After posting, fetch updated posts
        fetchPosts();
        // Clear the input fields
        setNewPostText("");
        setNewPostTag("");
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Please enter both text and tag.");
    }
  };

  const handleTagFilter = async () => {
    // Fetch posts filtered by tag
    // Implement the logic to filter posts by tag and update the 'posts' state accordingly
  };

  return (
    <div>
      <main>
        <h1>Custom Interface</h1>

        <h2>Connect to Web3</h2>
        {!web3 && <button onClick={connectWeb3}>Connect</button>}
        {web3 && (
          <div>
            <p>Connected with address: {userAddress}</p>
          </div>
        )}

        <h2>Post a Message</h2>
        {web3 && (
          <form onSubmit={handlePost}>
            <label>
              Text:
              <input
                type="text"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
            </label>
            <label>
              Tag:
              <input
                type="text"
                value={newPostTag}
                onChange={(e) => setNewPostTag(e.target.value)}
              />
            </label>
            <button type="submit">Post</button>
          </form>
        )}

        <h2>Posts</h2>
        {posts.map((post, index) => (
          <div key={index}>
            <p>User Address: {post.user}</p>
            <p>Text: {post.content}</p>
            <p>Tag: {post.tag}</p>
          </div>
        ))}

        <h2>Filter by Tag</h2>
        <label>
          Tag:
          <input
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </label>
        <button onClick={handleTagFilter}>Filter</button>
      </main>
    </div>
  );
}
