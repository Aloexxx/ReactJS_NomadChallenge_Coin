import { useQuery } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { fetchCoins } from "../api";

const Container = styled.div`
    padding:0px 20px;
    width:80%;
    margin:0 auto;
`;

const Header = styled.header`
    position:relative;
    width:100%;
    height:10vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const CoinsList = styled.ul`
    display:grid;
    width:100%;
    grid-template-columns:repeat(3,1fr);
`;

const Coin = styled.li`
    background-color:white;
    color:${props=>props.theme.textColor};
    padding:20px;
    border-radius:15px;
    margin:10px;
    box-shadow:3px 3px 3px;
    a{
        display:flex;
        padding:20px;
        transition:color 0.2s ease-in;
        align-items:center;
    }
    &:hover{
        a{
            color:${props=>props.theme.accentColor};
        }
    }
`;

const Title = styled.h1`
    font-size:48px;
    color:${(props)=>props.theme.accentColor};
`;
const Loader = styled.span`
    text-align:center;
    display:block;
`;

const Img = styled.img`
    width:35px;
    height:35px;
    margin-right:10px;
`;

interface CoinInterface {
    id: string,
    name: string,
    symbol: string,
    rank: number,
    is_new: boolean,
    is_active: boolean,
    type: string,
}

function Coins(){
    const [darkAtom,setDarkAtom] = useRecoilState(isDarkAtom)
    const toggleDarkAtom = ()=>setDarkAtom((prev)=>!prev)
    const {isLoading,data} = useQuery<CoinInterface[]>("allCoins",fetchCoins)
    
    return (
        <Container>
            <Header>
                <Title>COIN</Title>
                <button style={{position:"absolute",right:0}} onClick={toggleDarkAtom}>
                    {darkAtom?<span>🎆</span>:<span>🎇</span>}
                </button>
            </Header>
            {isLoading?
                <Loader>
                    "Loading..."
                </Loader>
            :
                <CoinsList>
                    {data?.slice(0,100).map(coin=>
                        <Coin key={coin.id}>
                            <Link to={{
                                pathname:`${process.env.PUBLIC_URL}/${coin.id}`,
                                state:{name:coin.name}
                            }}>
                                <Img src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLocaleLowerCase()}`}/>
                                {coin.name}&rarr;
                            </Link>
                        </Coin>
                    )}
                </CoinsList>
            }
        </Container>
        )
    }
    
    export default Coins;