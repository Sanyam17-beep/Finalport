import Searchcontainer from "./Searchcontainer";
import { Suspense, useEffect, useState } from "react";
import WorkCards from "./WorkCards";
import {useSwipeable} from "react-swipeable"
import "./Cards.css"
import LazySpinnerLoader from "../LazyComponents/LazySpinnerLoader";

import { useDispatch, useSelector } from "react-redux";
import { actions, fetchDataStrapi } from "../Slices/dataSlice";
import { faArrowCircleRight, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import NoRecord from "./NoRecordsFound/NoRecord";

function SearchCards({ chunckSize }) {
  const dispatch = useDispatch();
  const size = useSelector(state=>state.preloader.size);
  const { result: data } = useSelector(state => state.preloader.data);
  const searchStatus = useSelector(state => state.preloader.searchingStatus);
  const [currPage, setPage] = useState(0);
  const [currData,setData] = useState(data.slice(0,chunckSize));
  const response = { status: "pending", data: null }
  const navigateNext = (idx) => {
    dispatch(actions.updateSearchStatus({ val: true }));
    const start = (idx * chunckSize)
    const end = Math.min(size, (idx * chunckSize) + chunckSize);
    setData(data.slice(start,end));
    setPage(idx);
    let pagesBtn = document.querySelectorAll(".pagination-ul li");
    pagesBtn.forEach(ele=>{
      ele.classList.remove("active");
    })
    pagesBtn[idx].classList.add("active");
  }
  const addPagination = (pagesBtn) => {
    try {


      const clearActivePage = () => {

        pagesBtn.forEach((el) => el.classList.remove("active"));

      }
      clearActivePage();
      pagesBtn.forEach((el) => {
        el.addEventListener("click", () => {
          clearActivePage();
          el.classList.add("active");
        })
      })
    }
    catch {

    }
  }
  const sleep = (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    })
  }
  const suspend = (fn) => {
    const suspender = fn().then(
      (res) => {
        response.status = 'success';
        response.data = res;
      },
      (error) => {
        response.status = 'error';
        response.data = error;
      }
    );

    switch (response.status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response.data;
      default:
        return response.data;
    }
  }

  const Temporary = () => {
    if (searchStatus) {

      const data = suspend(async () => {
        await sleep(50);
        return 10;
      })

      dispatch(actions.updateSearchStatus({ val: false }));
    }

  }
  useEffect(()=>{
    
    const start = (0 * chunckSize)
    const end = Math.min(size, (0 * chunckSize) + chunckSize);
    setData(data.slice(start,end));
    setPage(0);
  },[data])
  useEffect(() => {
    if(data.length==0)return;
    let pagesBtn = document.querySelectorAll(".pagination-ul li");
    addPagination(pagesBtn);
    pagesBtn[0].classList.add("active");
  }, [data]);
  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {      if(currPage != Math.ceil(size/ chunckSize)-1)navigateNext(currPage+1);},
     onSwipedRight: (eventData) => {   if(currPage!=0)navigateNext(currPage-1);},
    delta: 10,                             // min distance(px) before a swipe starts. *See Notes*
    preventScrollOnSwipe: true,           // prevents scroll during swipe (*See Details*)
    trackTouch: true,                      // track touch input
    trackMouse: false,                     // track mouse input
    rotationAngle: 0,                      // set a rotation angle
    swipeDuration: Infinity,               // allowable duration of a swipe (ms). *See Notes*
    touchEventOptions: { passive: true },
  });
  return (
    <div className="App-header">
      <Searchcontainer chunckSize={chunckSize} idx={currPage} setPage={setPage} setData={setData}></Searchcontainer>
      <div className="projects-card-container">
        <div className="skill-card-show">
          <div class="container" {...handlers}>
            {
              currData?.length != 0 ?
                (
                  <Suspense fallback={<LazySpinnerLoader></LazySpinnerLoader>}>

                    {searchStatus === false ?
                      (currData?.map(card => {
                        return (

                          <WorkCards title={card?.Title} para={card?.para} imageurl={card?.imageUrl} cardText={card?.shortdesc} backcolor={card?.buttoncolor} tags={card?.Tags} desc={card?.Description} previewlink={card?.previewlink} sourcecodelink={card?.sourcecodelink}></WorkCards>

                        )
                      })) :
                      (
                        
                        <Temporary></Temporary>
                        
                      )
                    }

                    {/* <LazySpinnerLoader></LazySpinnerLoader> */}
                  </Suspense>)
                // (
                //   <LazySpinnerLoader></LazySpinnerLoader>
                // )
                :
                (
                  <NoRecord></NoRecord>
                )

            }
          </div>



        </div>

      </div>
      <div className="pagination-content" style={{ flexDirection: "row", justifyContent: "center" }}>
        {currPage != 0 && data.length > 1 && <FontAwesomeIcon icon={faArrowCircleLeft} color="white" onClick={()=>navigateNext(currPage-1)}></FontAwesomeIcon>}
        <ul class="pagination-ul">
          {
            (
              Array.from({ length: Math.ceil(size / chunckSize) }, () => Math.random()).map((ele, idx) => {

                return (
                  <li role="presentation" onClick={() => navigateNext(idx)} key={idx}><button></button></li>
                )
              })
            )}
        </ul>
        {currPage != Math.ceil(size / chunckSize)-1 && data.length !=0 &&  <FontAwesomeIcon icon={faArrowCircleRight} color="white" onClick={()=>navigateNext(currPage+1)}></FontAwesomeIcon>}
      </div>
    </div>
  );
}

export default SearchCards;
