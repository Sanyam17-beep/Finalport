import React, { useEffect, useState } from 'react'
import App from './App'
import Preloader from './components/Preloader'
import { gsap } from 'gsap'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import MobileSkillPage from './pages/MobileSkillPage';
import MobileConnect from './pages/MobileConnect';
import Product from './pages/Product';
import SideBar from './components/SideBar';
import Connect from './components/Connect';
import Helmet from "react-helmet";
import Glitch from './components/Glitch';
import { useDispatch, useSelector } from 'react-redux';
import {fetchDataStrapi,countData} from "../src/Slices/dataSlice";
import MobileWork from './pages/MobileWork';

function Root({store:store}) {
 
  const dispatch = useDispatch();
  const storeLoader = useSelector((state)=>state.preloader.loading);
  let chunkSize = 4;
  console.log(chunkSize);
  const location = useLocation();
  const [dateState, setDateState] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const slideUp = () => {
    const tl = gsap.timeline();
    tl.to(".pre", { height: 0, overflow: "hidden", duration: 1, smoothOrigin: true })
      .call(setLoading, [false]);
  }
  useEffect(()=>{
    const query = `count(*[_type=="Projects"])`;
    dispatch(countData(query));
  })
  useEffect(() => {
    if (window.innerWidth < 1000) {
      setMobileMenu(true);
      chunkSize = 1;
    } else {
      if (mobileMenu) {
        setMobileMenu(false);
      }
      
    }
  }, [])

  useEffect(() => {
   
    dispatch(fetchDataStrapi());
    
  },[]);
  useEffect(()=>{
    if(storeLoader==false){
      
      slideUp();
    }
  },[storeLoader]);
  return (
    <>
      <Preloader></Preloader>
      {!loading && (
        <AnimatePresence mode='wait' initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<App mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} dateState={dateState} setDateState={setDateState}></App>}></Route>
            <Route path='/skills' element={mobileMenu == false ? (<Skills></Skills>) : (<MobileSkillPage></MobileSkillPage>)}></Route>
            <Route path='/experience' element={<Experience></Experience>}></Route>
            {mobileMenu && (
              <Route path='/projects' element={<MobileWork></MobileWork>}></Route>
              
            )}
            <Route path='/projects' element={<Projects></Projects>}>
            </Route>
            
            <Route path="/projectone" element={<Product></Product>}></Route>
            {mobileMenu && (
              <Route path='/connect' element={<MobileConnect></MobileConnect>}></Route>
              
            )}
            
            <Route path='*' element={<Glitch></Glitch>}></Route>
          </Routes>
        </AnimatePresence>
      )}
      {mobileMenu && (
        <>
        <Helmet>
        <link rel='stylesheet' href='./KOPL.css' />
      </Helmet>
        <SideBar dateState={dateState} id="sidenav"></SideBar>
        </>
      )}
      {!loading && !mobileMenu && (
        <>
          <Helmet>
            <link rel='stylesheet' href='./connect.css' />
          </Helmet>
          <Connect></Connect>
        </>
      )}
    </>
  )
}

export default Root