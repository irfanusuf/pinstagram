import React, { useCallback, useEffect, useState } from "react";
import "./GetAllPosts.css";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { LuMessageCircle } from "react-icons/lu";
import { FaShare } from "react-icons/fa";
import CommentBox from "./CommentBox";
import { SlUser } from "react-icons/sl";
import { Link } from "react-router-dom";
import Loader from "../sharedComponents/Loader";
import { ToastContainer, toast } from "react-toastify";
import { HiDotsVertical } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";
import { MdReport } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const GetAllPosts = () => {
  const [data, setData] = useState([]);
  const [heart, setHeart] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentSucess, setCommentSucess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postnotAvailable, setpostnotAvailable] = useState("");

  const [dropdown, handleDropDown] = useState(null);

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const handleComment = (postId) => {
    setSelectedPost(postId);
  };

  const handleDelete = (postId) => {
    try {
      const res = axios.post(
        `http://localhost:4000/post/deletePost?postId=${postId}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );
      
      console.log(res)
      // if(res.data.message === "Post Deleted!"){
      //   toast.success("Post Deleted!")
      //   setCommentSucess(!commentSucess)
      // }
      // else{
      //   toast.error("Can't del post !")
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (postId) => {
    const response = await axios.post(
      `http://localhost:4000/post/likes?postId=${postId}`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );

    if (response.data.message === `U Liked post _${postId}`) {
      setHeart(postId);
    } else if (response.data.message === `U unliked post_${postId}`) {
      setHeart(null);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:4000/posts",

        {
          headers: {
            token: token,
          },
        }
      );
      if (res.data.message === "Posts Found!") {
        setData(res.data.allposts);

        if (res.data.allposts.length === 0) {
          setpostnotAvailable("NO POSTS AVAILABLE !");
          toast.error("NO POSTS AVAILABLE !");
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [heart, commentSucess, fetchData]);

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="main">
        <h1> Explore </h1>

        <div className="container">
          {data.length === 0 && (
            <h1 style={{ color: "wheat", marginTop: "300px" }}>
              {postnotAvailable}
            </h1>
          )}

          {loading ? (
            data.map((post) => (
              <div className="card">
                <div className="post">
                  <div className="heading">
                    <div className="profile-pic">
                      {post.author.profilepIcUrl ? (
                        <img src={post.author.profilepIcUrl} alt="no-preview" />
                      ) : (
                        <SlUser style={{ fontSize: "30px" }} />
                      )}
                    </div>

                    <Link to={`/profile/${post.author._id}`}>
                      <b>
                        {post && post.author
                          ? post.author.username
                          : "Default Author"}
                      </b>
                    </Link>

                    <HiDotsVertical
                      style={{
                        fontSize: "22px",
                        position: "absolute",
                        right: "0",
                      }}
                      onClick={() => {
                        handleDropDown(post._id);
                      }}
                    />

                    <div
                      className={
                        dropdown === post._id ? "drop-down" : "display-none "
                      }
                    >
                      <span>
                        {" "}
                        <AiFillDelete
                          style={{ color: "red", fontSize: "larger" }}
                          onClick={() => {
                            handleDelete(post._id);
                          }}
                        />
                      </span>

                      <span>
                        {" "}
                        <MdReport
                          style={{ color: "red", fontSize: "larger" }}
                        />{" "}
                      </span>

                      <span>
                        {" "}
                        <IoMdClose
                          onClick={() => {
                            handleDropDown(null);
                          }}
                          style={{ fontSize: "larger" }}
                        />
                      </span>
                    </div>
                  </div>

                  <img
                    onDoubleClick={() => {
                      handleLike(post._id);
                    }}
                    src={post.imageUrl}
                    alt="preview"
                  />

                  <div className="icons">
                    <span
                      onClick={() => {
                        handleLike(post._id);
                      }}
                    >
                      {post.likeCounts.findIndex(
                        (param) => param.user._id.toString() === userId
                      ) > -1 ? (
                        <FaHeart style={{ color: "red" }} />
                      ) : (
                        <FaRegHeart />
                      )}
                    </span>

                    <span
                      onClick={() => {
                        handleComment(post._id);
                      }}
                    >
                      <LuMessageCircle />
                    </span>

                    <span>
                      <FaShare />
                    </span>
                  </div>

                  <div className="counts">
                    <span>{post.likeCounts.length}</span>
                    <span>{post.comments.length}</span>
                    <span>{post.shareCounts.length}</span>
                  </div>

                  <b style={{ marginTop: "10px" }}>
                    {post && post.title ? post.title.toUpperCase() : null}
                  </b>

                  <b> {post.caption}</b>
                </div>

                <CommentBox
                  post={post}
                  selectedPost={selectedPost}
                  token={token}
                  setCommentSucess={setCommentSucess}
                  commentSucess={commentSucess}
                  setSelectedPost={setSelectedPost}
                />
              </div>
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
};

export default GetAllPosts;
