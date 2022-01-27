import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Route, Switch, useLocation, useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
    background-color:white;
    padding:0px 20px;
    max-width:480px;
    min-height:650px;
    margin:100px auto;
    border-radius:20px;
    box-shadow:3px 3px 6px;
`;
const Header = styled.header`
    position:relative;
    height:10vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;
const Title = styled.h1`
    font-size:48px;
    color:${(props)=>props.theme.accentColor};
`;
const Loader = styled.span`
    text-align:center;
    display:block;
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const Tab = styled.span<{isActive:boolean}>`
  text-align:center;
  text-transform:uppercase;
  font-size:12px;
  font-weight:400;
  background-color:rgba(0, 0, 0, 0.5);;
  padding: 7px 0px;
  border-radius:10px;
  color:${(props)=>props.isActive?props.theme.accentColor:props.theme.textColor};
  a{
    display:bolck;
  }
`;

interface RouteParams{
    coinId:string
}
interface RouteState{
    name:string;
}
interface InfoData{
    id:string;
    name:string;
    symbol:string;
    rank:number;
    is_new:boolean;
    is_active:boolean;
    type:string;
    description:string;
    message:string;
    open_source:boolean;
    started_at:string;
    development_status:string;
    hardware_wallet:boolean;
    proof_type:string;
    org_structure:string;
    hash_algorithm:string;
    first_data_at:string;
    last_data_a:string;
}
interface PriceData{
    id:string;
    name:string;
    symbol:string;
    rank:number;
    circulating_supply:number;
    total_supply:number;
    max_supply:number;
    beta_value:number;
    first_data_at:string;
    last_updated:string;
    quotes:{
        USD:{
            ath_date:string;
            ath_price:number;
            market_cap:number;
            market_cap_change_24h:number;
            percent_change_1h:number;
            percent_change_1y:number;
            percent_change_6h:number;
            percent_change_7d:number;
            percent_change_12h:number;
            percent_change_15m:number;
            percent_change_24h:number;
            percent_change_30d:number;
            percent_change_30m:number;
            percent_from_price_ath:number;
            price:number;
            volume_24h:number;
            volume_24h_change_24h:number;
        }
    };
}

function Coin(){
  const {coinId} = useParams<RouteParams>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const {isLoading:infoLoading,data:infoData} = useQuery<InfoData>(["info",coinId],()=>fetchCoinInfo(coinId))
  const {isLoading:tickersLoading,data:tickersData} = useQuery<PriceData>(["tickers",coinId],()=>fetchCoinTickers(coinId),{
    refetchInterval:3000,
  })

  useEffect(()=>{
    tickersLoading?null:console.log(tickersData,"priceData")
  },[tickersLoading])
  
  const loading = infoLoading||tickersLoading;
  return(
      <Container>
        <Header>
            <Link to={`${process.env.PUBLIC_URL}/`} style={{position:"absolute",left:0}}>◀</Link>
            <Title>{tickersData?.name||"Loading"}</Title>
        </Header>
          {loading?<Loader>Loading...</Loader>:
              <>
              <Overview>
                <OverviewItem>
                  <span>Rank:</span>
                  <span>{infoData?.rank}</span>
                </OverviewItem>
                <OverviewItem>
                  <span>Symbol:</span>
                  <span>${infoData?.symbol}</span>
                </OverviewItem>
                <OverviewItem>
                  <span>Price:</span>
                  <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
                </OverviewItem>
              </Overview>
              <Description>{infoData?.description}</Description>
              <Overview>
                <OverviewItem>
                  <span>Total Suply:</span>
                  <span>{tickersData?.total_supply}</span>
                </OverviewItem>
                <OverviewItem>
                  <span>Max Supply:</span>
                  <span>{tickersData?.max_supply}</span>
                </OverviewItem>
              </Overview>
              <TabBar>
                <Tab isActive={chartMatch!==null}>
                  <Link to={`${process.env.PUBLIC_URL}/${coinId}/chart`}>Chart</Link>
                </Tab>
                <Tab isActive={priceMatch!==null}>
                  <Link to={`${process.env.PUBLIC_URL}/${coinId}/price`}>Price</Link>
                </Tab>
              </TabBar>
              <Switch>
                  <Route path={`${process.env.PUBLIC_URL}/:coinId/chart`}>
                      <Chart coinId={coinId}/>
                  </Route>
                  <Route path={`${process.env.PUBLIC_URL}/:coinId/price`}>
                      <Price coinId={coinId}/>
                  </Route>
              </Switch>
            </>
          }
      </Container>
    )
}

export default Coin;