import { useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import axios from "axios";
import { useEffect } from "react";
import timeElapsed from "~/future/timeElapsed";

import routesConfig from "~/config/router";
import Button from "~/components/Button";
import style from "./Questions.module.scss";

const cx = classNames.bind(style);

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestion = async () => {
      await axios.get("/api/questions").then((res) => {
        setQuestions(res.data);
      });
    };
    getQuestion();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h1>Top Questions</h1>
      </div>
      <div className={cx("container")}>
        {questions.map((question) => {
          let tags = JSON.parse(question.tags[0]);

          let questionTime = timeElapsed(question.createdAt);

          return (
            <div key={question._id} className={cx("item")}>
              <div className={cx("header")}>
                <Link className={cx("user")} to={routesConfig.home}>
                  <div className={cx("avata")}>
                    <img
                      src={question.user.avatar}
                      alt={question.user.username}
                    />
                  </div>
                  <div className={cx("username")}>{question.user.username}</div>
                  <Tippy content="Điểm hoạt động">
                    <div className={cx("score")}>
                      {question.user.reputationScore}
                    </div>
                  </Tippy>
                </Link>

                <div className={cx("info")}>
                  <span>{question.upvote + question.downvote} vote</span>
                  <span>0 answers</span>
                  <span>{question.viewed} views</span>
                  <span>asked {questionTime}</span>
                </div>
              </div>
              <div className={cx("title")}>
                <Link to={`/question/${question._id}`} className={cx("link")}>
                  {question.title}
                </Link>
              </div>
              <div className={cx("tags")}>
                {tags.map((tag, index) => (
                  <Button key={index} text small className={cx("tag")}>
                    #{tag}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
