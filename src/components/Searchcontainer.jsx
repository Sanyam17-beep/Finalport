import { Tag, TagGroup } from 'rsuite';
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, countData } from '../Slices/dataSlice';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchQueryBased, fetchDataStrapi, filterByTags } from '../Slices/dataSlice';

function Searchcontainer({ chunckSize, idx, setPage }) {
  const ctag = useRef();
  const dispatch = useDispatch();
  const [searchTitle, setSearchTitle] = useState("");
  const [isActive, setActive] = useState("false");
  const displayTags = ["Html", "Css", "MERN", "React", "NodeJS", "Responsive", "VITE","Javascript","GSAP","Next"];
  const [tags, setTags] = useState([]);
  const [bgColor, setBgColor] = useState();
  const searchProject = () => {

    dispatch(actions.updateSearchStatus({ val: true }));
    const query = encodeURIComponent(`*[_type=='Projects' && Title match '${searchTitle}*']`);
    dispatch(countData(`count(${query})`));
    dispatch(fetchQueryBased(query));
  }

  const removeByKeyboard = (event, tag) => {
    if (event.code == "Backspace") {
      if (searchTitle == "") {
        if (tags.length > 0) {
          const nextTags = [...tags.slice(0, tags.length - 1)];
          let query = "";
          let j = 0;
          for (let i of nextTags) {
            query += `'${i}'`
            if (j != nextTags.length - 1) {
              query += ",";
            }
            j++;
          }
          dispatch(countData(`count(*[count((Tags)[@ in [${query}]]) == ${nextTags.length}])`));
          const nquery = `*[count((Tags)[@ in [${query}]]) == ${nextTags.length}]`;
          if (query == "") {
            dispatch(fetchDataStrapi());
          } else {
            dispatch(filterByTags({ nquery }));
          }

          dispatch(actions.updateSearchStatus({ val: true }));
          setTags(nextTags);

          dispatch(actions.updateSearchStatus({ val: true }));
        }
      } else {
        setSearchTitle("");
        let query = "";
        let j = 0;
        for (let i of tags) {
          query += `'${i}'`
          if (j != tags.length) {
            query += ",";
          }
          j++;
        }
        dispatch(countData(`count(*[count((Tags)[@ in [${query}]]) == ${tags.length}])`));
        dispatch(fetchDataStrapi());
      }
      return;
    }
  }
  const removeTags = (event, tag) => {
    const nextTags = tags.filter(item => item !== tag.toLowerCase());
    let query = "";
    let j = 0;
    for (let i of nextTags) {
      query += `'${i}'`
      if (j != nextTags.length - 1) {
        query += ",";
      }
      j++;
    }
    dispatch(countData(`count(*[count((Tags)[@ in [${query}]]) == ${nextTags.length}])`));
    const nquery = `*[count((Tags)[@ in [${query}]]) == ${nextTags.length}]`;
    if (query == "") {
      dispatch(fetchDataStrapi());
    } else {
      dispatch(filterByTags({ nquery }));
    }

    dispatch(actions.updateSearchStatus({ val: true }));
    setTags(nextTags);
  }
  const addTags = (tag) => {
    if (!tags.includes(tag.toLowerCase())) {
      let query = "";
      let j = 0;
      for (let i of tags) {
        query += `'${i}'`
        if (j != tags.length) {
          query += ",";
        }
        j++;
      }
      query += `'${tag.toLowerCase()}'`;
      dispatch(countData(`count(*[count((Tags)[@ in [${query}]]) == ${tags.length + 1}])`));
      const nquery = `*[count((Tags)[@ in [${query}]]) == ${tags.length + 1}]`;
      dispatch(filterByTags({ tags: [...tags, tag.toLowerCase()], count: tags.length + 1, start: (idx * chunckSize), chunkSize: Math.min(6, (idx * chunckSize) + chunckSize), nquery }));
      setTags([...tags, tag.toLowerCase()]);
      dispatch(actions.updateSearchStatus({ val: true }));
    }
    if (chunckSize == 1) {

    }

  }
  return (
    <div>
      <div className="tagandsearch">
        <div className="search-wrapper-tags">
          {/*<div className="searchIcon">
          <FontAwesomeIcon icon={faSearchengin} color="#000000" />
        </div>*/}
          <div className="search-input-area-tag">
            <div className="tagging-area">
              {tags.map((t) => {
                return (
                  <Tag style={{ height: "32px", backgroundColor: "#68626266", color: "white", borderRadius: "20px" }} size="lg" closable onClose={(event) => removeTags(event, t)}>{t}</Tag>
                )
              })}
            </div>
            <div className="regular-search-text">
              <input className="search-text" type="text" name="" id="Search-bar" placeholder="Look Out" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} onKeyUp={(event) => removeByKeyboard(event)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 10 }} >
              <FontAwesomeIcon icon={faSearch} style={{ color: "#e2e5e9" }} onClick={() => searchProject()} />
            </div>

          </div>

        </div>
        <div className="display-skills-tags-container">
          <div className={`display-skills-tags ${isActive ? "hide" : "show"}`}>
            <div className='fa fa-angle-down' onClick={() => {
              setActive(!isActive);
            }}></div>
            <TagGroup>
              {displayTags.map((t) => {
                return (
                  <Tag ref={ctag} size="lg" style={{ height: "32px", padding: "5px 20px 0px 20px", width: "fit-content", backgroundColor: "#68626266", color: "white", borderRadius: "20px", cursor: "pointer" }} onClick={() => addTags(t)} >{t}</Tag>
                )
              })}
            </TagGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Searchcontainer
